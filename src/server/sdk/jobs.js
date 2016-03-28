'use strict';

const DAYS_TO_EXPIRE = process.env.JOBS_DAYS_TO_EXPIRE || 30;
const knex = require('server/db');
const validator = require('server/validator');
const Joi = validator.Joi;

/**
 * Create new job listing
 */
function create(params) {
  return validator.params(params, {
      'title': Joi.string().required(),
      'location': Joi.string().required(),
      'description': Joi.string().required(),
      'category': Joi.string().required(), // One of pre-defined categories
      'company_name': Joi.string().required(),
      'company_url': Joi.string().required(),
      'company_logo_url': Joi.string(),
      'company_email': Joi.string().email().required()
    }).then(function (params) {
      let now = new Date();
      let dt_expires = new Date();
      dt_expires.setDate(dt_expires.getDate() + DAYS_TO_EXPIRE);

      let storedJob = {
        title: params.title,
        location: params.location,
        description: params.description,
        category: params.category,
        company_name: params.company_name,
        company_url: params.company_url,
        company_logo_url: params.company_logo_url,
        company_email: params.company_email,
        dt_created: now,
        dt_updated: now,
        dt_expires
      };

      return knex('jobs')
        .insert(storedJob)
        .returning('id') // Postgres only!
        .then(function (id) {
          // Return job object with insert id
          return Object.assign({ id }, storedJob);
        });
    });
}

module.exports = { create };
