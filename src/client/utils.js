const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:1339/api/' : 'http://localhost:1339/api/';

/**
 * Delete null properties from object
 * Used typically before sending JSON via fetch()
 *
 * @param {Object} data
 * @return {Object}
 */
function withoutNullProperties(data) {
  var obj = Object.assign({}, data);

  for (var i in obj) {
    if (obj[i] === null) {
      delete obj[i];
    }
  }

  return obj;
}

/**
 * Simple wrapper around fetch() API to add base API url
 */
function fetchApi(url, params) {
  return fetch(baseUrl + url, params)
    .then((response) => response.json())
    .then((response) => {
      let httpStatus = response.http_status;

      // OK, continue...
      if (httpStatus >= 200 && httpStatus < 300) {
        return Promise.resolve(response);

      // Error, throw!
      } else {
        let err = new Error('Error ' + httpStatus + ': ' + response.message);
        err.field_errors = response ? response.field_errors : {};
        throw err;
      }
    });
}

module.exports = { withoutNullProperties, fetchApi };
