'use strict';

const utils = require('client/utils');

function noop() {
  return Promise.resolve();
}

function findById(id) {
  return utils.fetchApi('users/' + id);
}

function findByLogin(data) {
  return utils.fetchApi('users/login', {
    method: 'POST',
    body: JSON.stringify(utils.withoutNullProperties(data))
  });
}

function register(data) {
  return utils.fetchApi('users/register', {
    method: 'POST',
    body: JSON.stringify(utils.withoutNullProperties(data))
  });
}

// None of these are setup right now, but they will call the API eventually...
module.exports = {
  findById: noop,
  findByLogin,
  register
};

