'use strict';

const knex = require('server/db');
const sdkJobs = require('server/sdk/jobs');
const sdkUsers = require('server/sdk/users');
const errors = require('shared/errors');

function jobs() {
  return sdkJobs;
}

function users() {
  return sdkUsers;
}


/**
 * Respond to an HTTP request with an error response from given Error object
 *
 * @param err Error
 * @return object
 */
function respondWithError(req, res) {
  return function(err) {
    let errorJson = {
      result: 'error',
      http_status: 500,
      error_type: 'general',
      message: err.message,
      errors: []
    };

    // Handle Joi ValidationError objects
    // @link https://github.com/hapijs/joi/blob/v7.2.3/API.md#errors
    if (err.isJoi === true) {
      errorJson.error_type = 'validation';
      errorJson.http_status = 400;
      errorJson.message = 'Validation error(s) have occured';
      errorJson.field_errors = {};
      for(var obj of err.details) {
        errorJson.field_errors[obj.path] = obj.message;
      }
    }

    // General ValidationError
    if (err instanceof errors.ValidationError) {
      errorJson.error_type = 'validation';
      errorJson.http_status = 400;
    }

    // 404 error
    if (err instanceof errors.NotFound) {
      errorJson.error_type = 'notfound';
      errorJson.http_status = 404;
    }

    // 401 error
    if (err instanceof errors.NotAuthorized) {
      errorJson.error_type = 'authentication';
      errorJson.http_status = 401;

      // Delete user cookie if invalid (caused 401)
      res.clearCookie('user');
    }

    // 403 error
    if (err instanceof errors.Forbidden) {
      errorJson.error_type = 'authorization';
      errorJson.http_status = 403;
    }

    // DEVELOPMENT mode gets the full stack trace
    if (process.env.NODE_ENV === 'development') {
      errorJson.stack = err.stack.split("\n");
    }

    res.status(errorJson.http_status).json(errorJson);
  };
}
module.exports = { jobs, users, respondWithError };
