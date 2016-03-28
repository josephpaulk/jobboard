'use strict';

const knex = require('server/db');
const sdkJobs = require('server/sdk/jobs');

function jobs() {
  return sdkJobs;
}

module.exports = { jobs };
