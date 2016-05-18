'use strict';

const frisby = require('frisby');
const baseUrl = 'http://localhost:1339/api';

describe('jobs API', function () {

  let access_token;
  beforeAll(function (done) {
    // Login as admin user to get and store access_token, then send it in each subsequent request
    frisby.post(baseUrl + '/users/login', {
        body: {
          email: 'user@example.com',
          password: 'password'
        }
      })
      .expect('status', 200)
      .then(function (json) {
        access_token = json.access_token;

        // Set 'Authorization' header for all further requests
        frisby.globalSetup({
          request: {
            headers: {
              'Authorization': 'Bearer ' + access_token
            }
          }
        });
      })
      .done(done);
  });

  it('should get list of all active jobs', function (done) {
    frisby.get(baseUrl + '/jobs')
      .expect('status', 200)
      .done(done);
  });

});
