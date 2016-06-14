'use strict';

// NPM
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Local
const DAYS_TO_EXPIRE = parseInt(process.env.USER_TOKEN_DAYS_TO_EXPIRE) || 30;
const FREE_JOB_CREDITS = 5;
const knex = require('server/db');
const errors = require('shared/errors');
const validator = require('server/validator');
const Joi = validator.Joi;

/**
 * Format user row to PUBLIC-FACING user object (returned in API responses)
 */
function _formatForAPI(row) {
  if (!row) { return false; }

  delete row.password;

  return row;
};

/**
 * Find user with id
 */
function findById(id) {
  return validator.params({ id }, {
      'id': Joi.number().required()
    }).then(function () {
      return knex('users')
        .first()
        .where({ id })
        .then(_formatForAPI);
    });
};

/**
 * Find user with API token
 */
function findByLogin(email, password) {
  let userObj;

  return validator.params({ email, password }, {
      'email': Joi.string().email().required(),
      'password': Joi.string().required()
    }).then(function () {
      return knex('users')
        .first()
        .where({ email })
        .then((user) => {
          // No user found by email address
          if (!user) {
            throw new errors.NotAuthorized("No user registered with provided email address");
          }

          // Incorrect password
          if (!bcrypt.compareSync(password, user.password)) {
            throw new errors.NotAuthorized("Incorrect user login. Please try again.");
          }

          return user;
        })
        .then(_formatForAPI)
        .then((user) => {
          userObj = user;
          return createAccessTokenForUser(user);
        })
        .then((access_token) => {
          // Add 'access_token' as a property to the returned user object
          userObj.access_token = access_token.access_token;
          return userObj;
        });
    });
};

/**
 * Find user with access_token
 */
function findByToken(access_token) {
  return validator.params({ access_token }, {
      'access_token': Joi.string().token().required()
    }).then(function () {
      return knex('user_auth_tokens')
        .first()
        .where({ access_token })
        .then((access_token) => {
          if (!access_token) {
            throw new errors.NotAuthorized('Invalid or expired user access_token');
          }

          return findById(access_token.user_id);
        });
    });
};

/**
 * Create new user access_token
 * (i.e. after a successful login attempt)
 */
function createAccessTokenForUser(user) {
  let dt_created = new Date();
  let access_token = crypto.createHash('sha1').update(dt_created.toString() + Math.random()).digest('hex');
  let dt_expires = new Date();
  dt_expires.setDate(dt_expires.getDate() + DAYS_TO_EXPIRE);

  let storedToken = {
    user_id: user.id,
    access_token,
    dt_created,
    dt_expires
  };

  return knex('user_auth_tokens')
    .insert(storedToken)
    .returning('id')
    .then(function (id) {
      // Return job object with insert id
      return Object.assign({ id: id[0] }, storedToken);
    });
}

/**
 * Create job credits records for user
 */
function createJobCreditsForUser(user, amount = 1) {
  let dt_created = new Date();

  let storedJobCredit = {
    user_id: user.id,
    job_id: null,
    amount,
    dt_created
  };

  return knex('user_job_credits')
    .insert(storedJobCredit)
    .returning('id')
    .then(function (ids) {
      // Return job object with insert id
      return Object.assign({ id: ids[0] }, storedJobCredit);
    });
}

/**
 * Register new user
 */
function register(fields) {
  return validator.params(fields, {
      'name': Joi.string().required(),
      'email': Joi.string().email().required(),
      'password': Joi.string().required(),
      'company_name': Joi.string(),
      'company_url': Joi.string().uri().lowercase(),
      'company_logo_url': Joi.string().uri().lowercase().trim().allow(['', null]),
      'company_email': Joi.string().email().lowercase()
    }).then(function (fields) {
      let { name, email, password, company_name, company_url, company_logo_url, company_email } = fields;
      let storedUser = {
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        company_name,
        company_url,
        company_logo_url,
        company_email,
        is_active: true,
        is_admin: false,
        dt_created: new Date()
      };

      return knex('users')
        .insert(storedUser)
        .returning('id')
        .then(function (id) {
          let user = Object.assign({ id: id[0] }, storedUser);

          // Create credits, but don't hold up response for it
          createJobCreditsForUser(user, FREE_JOB_CREDITS);

          return createAccessTokenForUser(user).then((user_access_token) => {
            // Add 'access_token' and return
            user.access_token = user_access_token.access_token;
            return user;
          });
        })
        .then(_formatForAPI);
    });
};

module.exports = { findById, findByLogin, findByToken, register };
