'use strict';

const Router = require('shared/router');
const Homepage = require('components/Homepage');
const JobList = require('components/JobList');
const JobForm = require('components/JobForm');
const JobDetail = require('components/JobDetail');
const JobPreview = require('components/JobPreview');

// Setup routes
let router = new Router();

router.get('/', Homepage);
router.get('/jobs', JobList);
router.get('/jobs/create', JobForm);
router.get('/jobs/:id', JobDetail);
router.get('/jobs/:id/preview', JobPreview);

module.exports = router;
