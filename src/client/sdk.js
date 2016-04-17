'use strict';

function jobs() {
  return require('client/sdk/jobs');
}

function users() {
  return require('client/sdk/users');
}

module.exports = { jobs, users };

