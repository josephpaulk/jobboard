'use strict';

const TABLE_NAME = 'jobs';
const DAYS_TO_EXPIRE = parseInt(process.env.JOBS_DAYS_TO_EXPIRE) || 30;
const knex = require('server/db');
const validator = require('server/validator');
const config = require('shared/config');
const Joi = validator.Joi;

/**
 * List all active jobs
 */
function allActive() {
  let now = new Date();

  return knex(TABLE_NAME)
    .where('dt_expires', '<=', now)
    .andWhere('is_live', true);
}

/**
 * Find job by id
 */
function findById(id) {
  return validator.params({ id }, {
      'id': Joi.number().required()
    }).then(function () {
      return knex(TABLE_NAME).first().where('id', id);
    });
}

/**
 * Create new job listing
 */
function create(params) {
  return validator.params(params, {
      'title': Joi.string().length(60).required(),
      'location': Joi.string().length(60).required(),
      'description': Joi.string().required(),
      'category': Joi.string().required().valid(Object.keys(config.jobs.categories)), // One of pre-defined categories keys
      'telecommute': Joi.string().required().valid(Object.keys(config.jobs.telecommute)), // One of pre-defined telecommute keys
      'company_name': Joi.string().required(),
      'company_url': Joi.string().uri().lowercase().required(),
      'company_logo_url': Joi.string().uri().lowercase().trim().allow('').replace(/$^/, null),
      'company_email': Joi.string().email().lowercase().required()
    }).then(function (params) {
      let now = new Date();
      let dt_expires = new Date();
      dt_expires.setDate(dt_expires.getDate() + DAYS_TO_EXPIRE);

      let storedJob = {
        title: params.title,
        location: params.location,
        description: params.description,
        category: params.category,
        telecommute: params.telecommute,
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
        .returning('id') // Postgres only!
        .then(function (id) {
          // Return job object with insert id
          return Object.assign({ id }, storedJob);
        });
    });
}

module.exports = { allActive, findById, create };
