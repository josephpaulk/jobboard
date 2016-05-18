'use strict';

const errors = require('shared/errors');
const sdk = require('server/sdk');

/**
 * Express.js Middleware
 * Load user account from provided access_token in request data
 */
function loadUserByAccessToken() {
  return function (req, res, next) {
    let access_token;
    res.locals.user = false;

    // Cookie auth
    if (req.cookies.user) {
      let userCookieValue = JSON.parse(req.cookies.user);
      if (userCookieValue.access_token) {
        access_token = userCookieValue.access_token;
      }
    }

    // Header auth
    let authHeader = req.get('Authorization');
    if (authHeader && authHeader.indexOf('Bearer ') === 0) {
      access_token = authHeader.replace('Bearer ', '');
    }

    // Query string
    if (!access_token && req.query.access_token) {
      access_token = req.query.access_token;
    }

    // JSON or urlencoded request body
    if (!access_token && req.body.access_token) {
      access_token = req.body.access_token;
    }

    // Found access_token - load user account
    if (access_token) {
      sdk.users()
        .findByToken(access_token)
        .then((user) => {
          // Set user on request and in 'locals' for EJS templates to use
          req.user = res.locals.user = user;
          next();
        })
        .catch(sdk.respondWithError(req, res));
    } else {
      next();
    }
  }
}

/**
 * Express.js Middleware
 * Force user auth - redirect or throw 401 Unauthorized error
 */
function userAuthRequired(options = {}) {
  return function (req, res, next) {
    if (req.user) {
      next();
    } else {
      if (options.redirectUrl) {
        res.redirect(options.redirectUrl);
      } else {
        let err = new errors.NotAuthorized("User login required");
        sdk.respondWithError(req, res)(err);
      }
    }
  };
}


module.exports = { loadUserByAccessToken, userAuthRequired };
