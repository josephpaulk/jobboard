const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:1339/api/' : 'http://localhost:1339/api/';
const Cookies = require('cookies-js');

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
  let storedResponse;
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  // Add token from cookie is present
  if (Cookies.get('user')) {
    headers['Authorization'] = 'Bearer ' + Cookies.get('user').access_token;
  }

  return fetch(baseUrl + url, Object.assign({
      credentials: 'same-origin',
      headers
    }, params))
    .then((response) => {
      storedResponse = response;
      return response;
    })
    .then((response) => response.json())
    .then((response) => {
      let httpStatus = storedResponse.status;

      // OK, continue...
      if (httpStatus >= 200 && httpStatus < 300) {
        return response;

      // Error, throw!
      } else {
        let err = new Error(response.message);
        err.error_message = response ? response.message : null;
        err.field_errors = response ? response.field_errors : {};
        throw err;
      }
    });
}

module.exports = { withoutNullProperties, fetchApi };
