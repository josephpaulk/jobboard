'use strict';

const TABLE_NAME = 'jobs';
const DAYS_TO_EXPIRE = parseInt(process.env.JOBS_DAYS_TO_EXPIRE) || 30;
const knex = require('server/db');
const config = require('shared/config');
const sharedUtils = require('shared/utils');
const errors = require('shared/errors');
const mailer = require('lib/mailer');
const validator = require('server/validator');
const Joi = validator.Joi;

/**
 * Format results for public API
 */
function _formatForApi(results) {
  // @TODO: Any formatting
  return results;
}

/**
 * List all active jobs
 *
 * @return Promise
 */
function allActive() {
  let now = new Date();

  return knex(TABLE_NAME)
    .where('dt_expires', '>=', now)
    .andWhere('is_live', true)
    .orderBy('dt_expires', 'desc')
    .then(_formatForApi);
}

/**
 * List all inactive jobs (typically used for admin users reviewing jobs
 * awaiting approval)
 *
 * @return Promise
 */
function allInactive() {
  let now = new Date();

  return knex(TABLE_NAME)
    .where('is_live', false)
    .orderBy('dt_created', 'desc')
    .then(_formatForApi);
}

/**
 * Find job by id
 *
 * @param {Number} id
 * @return Promise
 */
function findById(id) {
  return validator.params({ id }, {
      'id': Joi.number().required()
    }).then(function () {
      return knex(TABLE_NAME)
        .first()
        .where('id', id)
        .then(_formatForApi);
    });
}

/**
 * List all jobs for given user
 *
 * @param {Number} user_id
 * @return Promise
 */
function findByUserId(user_id) {
  return validator.params({ user_id }, {
      'user_id': Joi.number().required()
    }).then(function () {
      return knex(TABLE_NAME)
        .where({ user_id })
        .orderBy('dt_expires', 'desc')
        .then(_formatForApi);
    });
}

let job_schema = {
  'title': Joi.string().max(60).required(),
  'location': Joi.string().max(60).required(),
  'description': Joi.string().required(),
  'category': Joi.string().required().valid(Object.keys(config.jobs.categories)), // One of pre-defined categories keys
  'telecommute': Joi.string().required().valid(Object.keys(config.jobs.telecommute)), // One of pre-defined telecommute keys
  'apply_url': Joi.string().uri().lowercase().required(),
  'company_name': Joi.string().required(),
  'company_url': Joi.string().uri().lowercase().required(),
  'company_logo_url': Joi.string().uri().lowercase().trim().allow(['', null]),
  'company_email': Joi.string().email().lowercase().required()
};

/**
 * Create new job listing
 *
 * @return Promise
 */
function create(user, params) {
  // # of job credits to use for this job posting
  let use_credits = 1;

  return validator.params(params, job_schema)
    // Ensure user has enough job credits, but still return params for use
    .then((params) => ensureUserHasJobCredits(user.id, use_credits).then(result => params))
    .then(function (params) {
      let now = new Date();
      let dt_expires = new Date();
      dt_expires.setDate(dt_expires.getDate() + DAYS_TO_EXPIRE);

      let storedJob = {
        user_id: user.id,
        title: params.title,
        location: params.location,
        description: params.description,
        category: params.category,
        telecommute: params.telecommute,
        apply_url: params.apply_url,
        company_name: params.company_name,
        company_url: params.company_url,
        company_logo_url: params.company_logo_url || null,
        company_email: params.company_email,
        is_live: false,
        is_featured: false,
        dt_created: now,
        dt_updated: now,
        dt_expires
      };

      return knex(TABLE_NAME)
        .insert(storedJob)
        .returning('id')
        .then((id) => {
          // Return job object with insert id
          return Promise.resolve(Object.assign({ id: id[0] }, storedJob));
        })
        // Use job credit, but still return job row
        .then((job) => useUserJobCredits(job.user_id, job.id, use_credits).then(result => job))
        .then((job) => {
          // Send job created email, but don't wait for it to return response
          mailer.sendTemplate('jobs.create.after', { job }, { to: user.email, bcc: process.env.ADMIN_EMAILS });
          return job;
        })
        .then(_formatForApi);
    });
}

/**
 * Ensure user has enough job credits to create a new job
 */
function ensureUserHasJobCredits(user_id, required_credits) {
  return knex('user_job_credits')
    .sum('amount')
    .where({ user_id })
    .then((result) => {
      let remaining_credits = parseInt(result[0].sum);

      if (remaining_credits < required_credits) {
        throw new errors.PaymentRequired(
          'Not enough job credits remaining. Remaining credits: [' + remaining_credits + ']. Required credits: [' + required_credits + ']'
        );
      }
    });
}

/**
 * Use job credits for user
 */
function useUserJobCredits(user_id, job_id, use_credits) {
  return knex('user_job_credits')
    .insert({
      user_id,
      job_id,
      amount: - parseInt(use_credits),
      note: 'Job posting',
      dt_created: new Date()
    });
}

/**
 * Update existing job listing
 *
 * @return Promise
 */
function update(id, params) {
  let update_schema = Object.assign({}, job_schema);
  delete update_schema.user_id;

  return findById(id).then(function (job) {
    // Ensure user can update job
    if (!sharedUtils.userCanEditJob(params.user_id, job)) {
      throw new errors.Forbidden('You are not allowed to edit this job posting');
    }

    return validator.params(params, update_schema)
      .then(function (params) {
        let now = new Date();

        let storedJob = Object.assign({}, job, {
          title: params.title,
          location: params.location,
          description: params.description,
          category: params.category,
          telecommute: params.telecommute,
          apply_url: params.apply_url,
          company_name: params.company_name,
          company_url: params.company_url,
          company_logo_url: params.company_logo_url || null,
          company_email: params.company_email,
          dt_updated: now
        });

        // Discard fields we don't want to update
        delete storedJob.id;
        delete storedJob.user_id;
        delete storedJob.is_live;
        delete storedJob.is_featured;
        delete storedJob.dt_created;
        delete storedJob.dt_expires;

        return knex(TABLE_NAME)
          .update(storedJob)
          .where({ id })
          .then(function (id) {
            return Object.assign({}, job, storedJob);
          })
          .then(_formatForApi);
      });
    });
}

/**
 * Approve existing job listing
 *
 * @return Promise
 */
function approve(id, params) {
  return findById(id).then(function (job) {
    // Set posting exirpation date from date of approval
    let dt_expires = new Date();
    dt_expires.setDate(dt_expires.getDate() + DAYS_TO_EXPIRE);

    let updateData = {
      is_live: true,
      dt_expires
    };

    return knex(TABLE_NAME)
      .update(updateData)
      .where({ id })
      .then(function (id) {
        return Object.assign({}, job, updateData);
      })
      .then(_formatForApi);
  });
}

/**
 * Delete existing job listing
 *
 * @return Promise
 */
function del(id) {
  return findById(id).then(function (job) {
    return knex(TABLE_NAME)
      .where({ id })
      .del()
      .then(function () {
        return job;
      })
      .then(_formatForApi);
  });
}

module.exports = { allActive, allInactive, approve, findById, findByUserId, create, update, del };
