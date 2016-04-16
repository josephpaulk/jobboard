'use strict';

const utils = require('client/utils');

function noop() {
  return Promise.resolve();
}

function create(data) {
  return utils.fetchApi('jobs', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(utils.withoutNullProperties(data))
  });
}

// None of these are setup right now, but they will call the API eventually...
module.exports = {
  allActive: noop,
  findById: noop,
  create
};

