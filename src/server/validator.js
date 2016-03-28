'use strict';

const Joi = require('joi');
const validationOptions = { abortEarly: false };

/**
 * Validation (basically wraps Joi in a Promise)
 *
 * @param {Object} params   Data to validate against
 * @param {Object} schema   Joi Schema to use for validation
 * @return {Promise}
 */
function params(params, schema) {
  return new Promise(function (resolve, reject) {
    Joi.validate(params, schema, validationOptions, function (err, value) {
      if (err) {
        throw err;
      }

      resolve(value);
    })
  });
}

module.exports = { params, Joi };
