// NPM
import bcrypt from 'bcryptjs';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as LocalStrategy } from 'passport-local';

// Local
import { knex } from '../lib/db';

// Namespace
let User = {};

/**
 * Format user row to PUBLIC-FACING user object (returned in API responses)
 */
User.formatForAPI = function(row) {
  if (!row) { return false; }

  delete row.password;

  return row;
};


/**
 * Find user with API token
 */
User.findByToken = function(token) {
  return knex.first().from('users').where({ token }).then(User.formatForAPI);
};

/**
 * Find user with API token
 */
User.findByLogin = function(email, password) {
  return knex.first().from('users').where({ email, password }).then(User.formatForAPI);
};

/**
 * Register new user
 */
User.register = function(fields) {
  let { name, email, password } = fields;

  return knex('users').insert({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    dt_created: new Date()
  }).then(User.formatForAPI);
};


/**
 * Passport login strategy for authenticating with API token
 */
User.passportTokenStrategy = function() {
  return new BearerStrategy(function(token, cb) {
    User.findByToken(token)
      .then(function(user) {
        if (!user) {
          cb(null, false);
        } else {
          cb(null, user);
        }
      }).catch(function(err) {
        cb(err);
      });
  });
};


/**
 * Passport login strategy for authenticating with email/password
 */
User.passportLoginStrategy = function() {
  return new LocalStrategy({
      usernameField: 'email',
      passwordField: 'passwd',
    },
    function(email, password, cb) {
      User.findByLogin(email, password)
        .then(function(user) {
          if (!user) {
            cb(null, false);
          } else {
            cb(null, user);
          }
        }).catch(function(err) {
          cb(err);
        });
    }
  );
};

module.exports = User;
