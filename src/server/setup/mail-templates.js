'use strict';

const mailer = require('lib/mailer');
const validator = require('server/validator');
const Joi = validator.Joi;

// Common prefix
let preSubject = '[Techlahoma Jobs] ';

// USERS
mailer.addTemplate('users.register.after', {
  user: Joi.object().required()
}, {
  subject: preSubject + 'New User Registration'
});

// JOBS
mailer.addTemplate('jobs.create.after', {
  job: Joi.object().required()
}, {
  subject: preSubject + 'New Job Listing Created'
});
