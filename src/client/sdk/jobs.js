'use strict';

const utils = require('client/utils');

function noop() {
  return Promise.resolve();
}

function create(data) {
  return utils.fetchApi('jobs', {
    method: 'POST',
    body: JSON.stringify(utils.withoutNullProperties(data))
  });
}

function update(id, data) {
  return utils.fetchApi('jobs/' + id, {
    method: 'PUT',
    body: JSON.stringify(utils.withoutNullProperties(data))
  });
}

function del(id) {
  return utils.fetchApi('jobs/' + id, {
    method: 'DELETE'
  });
}

// Many of these are not setup right now, but they will call the API eventually...
module.exports = {
  allActive: noop,
  findById: noop,
  findByUserId: noop,
  create,
  update,
  del
};

