'use strict';

function noop() {
  return Promise.resolve();
}

// None of these are setup right now, but they will call the API eventually...
module.exports = {
  allActive: noop,
  findById: noop,
  create: noop
};

