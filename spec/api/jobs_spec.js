'use strict';

const frisby = require('frisby');
const baseUrl = 'http://localhost:1339/api';

it('should get list of all active jobs', function (done) {
  frisby.get(baseUrl + '/jobs')
    .expect('status', 200)
    .inspectStatus()
    .done(done);
});
