'use strict';

const TABLE_NAME = 'jobs';
const DAYS_TO_EXPIRE = parseInt(process.env.JOBS_DAYS_TO_EXPIRE) || 30;
const crypto = require('crypto');
const knex = require('server/db');
const config = require('shared/config');
const validator = require('server/validator');
const Joi = validator.Joi;

/**
 * Format results for public API
 */
function _formatForApi(results) {
  // @TODO: Any formatting
  results;
}

/**
 * List all active jobs
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
 * Find job by id
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
 * @return Array
 */
function findByUserId(user_id) {
  let now = new Date();

  return validator.params({ user_id }, {
      'user_id': Joi.number().required()
    }).then(function () {
      return knex(TABLE_NAME)
        .where({ user_id })
        .orderBy('dt_expires', 'desc')
        .then(_formatForApi);
    });
}

/**
 * Create new job listing
 */
function create(params) {
  return validator.params(params, {
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
    }).then(function (params) {
      let now = new Date();
      let dt_expires = new Date();
      dt_expires.setDate(dt_expires.getDate() + DAYS_TO_EXPIRE);

      // Generate admin key so we can store it in session for editing and payment association
      let admin_key = crypto.createHash('sha1').update(now.toString() + Math.random()).digest('hex');

      let storedJob = {
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
        admin_key: admin_key,
        dt_created: now,
        dt_updated: now,
        dt_expires
      };

      return knex(TABLE_NAME)
        .insert(storedJob)
        .returning('id') // Postgres only!
        .then(function (id) {
          // Return job object with insert id
          return Promise.resolve(Object.assign({ id: id[0] }, storedJob));
        })
        .then(_formatForApi);
    });
}

module.exports = { allActive, findById, create };
