'use strict';

const Router = require('shared/router');
const Homepage = require('components/Homepage');
const JobList = require('components/JobList');
const JobForm = require('components/JobForm');
const JobDetail = require('components/JobDetail');
const UserLogin = require('components/UserLogin');

// Setup routes
let router = new Router();

router.get('/', Homepage);
router.get('/login', UserLogin);
router.get('/jobs', JobList);
router.get('/jobs/create', JobForm);
router.get('/jobs/:id', JobDetail);

module.exports = router;
