'use strict';

/**
 * Have to create our own extendable Error type, due to the craziness that is JavaScript
 *
 * @see http://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax
 */
class ExtendableError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.stack = (new Error()).stack;
    this.name = this.constructor.name;
  }
}


/**
 * NotFoundError (Produces 404 error)
 */
class NotFound extends ExtendableError {
  constructor(msg) {
    super(msg);
  }
}

/**
 * NotAuthorized (Produces 401 error)
 */
class NotAuthorized extends ExtendableError {
  constructor(msg) {
    super(msg);
  }
}

/**
 * Forbidden (Produces 403 error)
 */
class Forbidden extends ExtendableError {
  constructor(msg) {
    super(msg);
  }
}

/**
 * Payment Required (Produces 402 error)
 */
class PaymentRequired extends ExtendableError {
  constructor(msg) {
    super(msg);
  }
}

/**
 * ValidationError (Produces 400 error)
 */
class ValidationError extends ExtendableError {
  constructor(msg) {
    super(msg);
  }
}

/**
 * Throw 404 'NotFound' error if there are no results
 */
function throwNotFoundIfNoResults(msg) {
  return function (results) {
    let embedded = results._embedded;
    if (!embedded) {
      throw new NotFound(msg);
    }

    // Check JSON API structure
    if (embedded) {
      let keys = Object.keys(embedded);
      keys.forEach(key => {
        if (!embedded[key] || embedded[key].length === 0) {
          throw new NotFound(msg);
        }
      })
    }

    // Return promise so further responses can be chained after this
    return Promise.resolve(results);
  };
}

module.exports = { Forbidden, NotFound, NotAuthorized, PaymentRequired, ValidationError, throwNotFoundIfNoResults };
