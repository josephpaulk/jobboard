'use strict';

// NPM
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Local
const DAYS_TO_EXPIRE = parseInt(process.env.USER_TOKEN_DAYS_TO_EXPIRE) || 30;
const knex = require('server/db');
const errors = require('shared/errors');
const validator = require('server/validator');
const Joi = validator.Joi;

/**
 * Format user row to PUBLIC-FACING user object (returned in API responses)
 */
function formatForAPI(row) {
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
        .then(formatForAPI);
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
        .then(formatForAPI)
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
 * Register new user
 */
function register(fields) {
  return validator.params(fields, {
      'name': Joi.string().required(),
      'email': Joi.string().email().required(),
      'password': Joi.string().required()
    }).then(function () {
      let { name, email, password } = fields;
      let storedUser = {
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        is_admin: false,
        dt_created: new Date()
      };

      return knex('users')
        .insert(storedUser)
        .returning('id')
        .then(function (id) {
          // Return job object with insert id
          return Object.assign({ id: id[0] }, storedUser);
        })
        .then(formatForAPI);
    });
};

module.exports = { findById, findByLogin, findByToken, register };
