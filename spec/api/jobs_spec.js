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

  it('should allow the creation of one new job', function (done) {
    frisby.post(baseUrl + '/jobs', {
        title: 'Test Job',
        location: 'Shawnee, OK',
        description: 'Some job you really don\'t want.',
        category: 'programming',
        telecommute: 'none',
        apply_url: 'http://example.com',
        company_name: 'ACME, Inc.',
        company_url: 'http://example.com',
        company_logo_url: null,
        company_email: 'user@example.com'
      })
      .expect('status', 201)
      .expect('jsonContains', {
        title: 'Test Job'
      })
      .then(function (json) {
        return frisby.post(baseUrl + '/jobs', {
            title: 'Not Enough Credits',
            location: 'Shawnee, OK',
            description: 'This job will not actually be posted, because the user does not have enough credits',
            category: 'programming',
            telecommute: 'none',
            apply_url: 'http://example.com',
            company_name: 'ACME, Inc.',
            company_url: 'http://example.com',
            company_logo_url: null,
            company_email: 'user@example.com'
          })
          .expect('status', 402)
          .expect('jsonContains', {
            error_type: 'payment_required'
          });
      })
      .done(done);
  });

});
