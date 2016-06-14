'use strict';

const frisby = require('frisby');
const baseUrl = 'http://localhost:1339/api';

describe('jobs API', function () {

  let access_token;
  it('should create a new user and a new job listing', function (done) {
    frisby.post(baseUrl + '/users/register', {
        body: {
          name: 'Testy McTestface',
          email: 'user+' + Math.random() + '@example.com',
          password: 'password'
        }
      })
      .expect('jsonContains', { name: 'Testy McTestface' })
      .expect('status', 201)
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
      .then(function (json) {
        // Create job posting
        return frisby.post(baseUrl + '/jobs', {
            body: {
              title: 'Test Job Posting',
              location: 'Tulsa, OK',
              description: 'Some job description here',
              category: 'programming',
              telecommute: 'none',
              apply_url: 'http://example.com',
              company_name: 'Example Company',
              company_url: 'http://example.com',
              company_logo_url: null,
              company_email: 'user@example.com',
            }
          })
          .expect('status', 201)
          .expect('jsonContains', { name: 'Test Job Posting' });
      })
      .done(done);
  });

});

