'use strict';

const Router = require('shared/router');
const Homepage = require('components/Homepage');
const JobList = require('components/JobList');
const JobCreate = require('components/JobCreate');
const JobDetail = require('components/JobDetail');
const JobPreview = require('components/JobPreview');
const UserLogin = require('components/UserLogin');
const UserRegister = require('components/UserRegister');

// Setup routes
let router = new Router();

router.get('/', Homepage);
router.get('/jobs', JobList);
router.get('/jobs/create', JobCreate);
router.get('/jobs/:id', JobDetail);
router.get('/jobs/:id/preview', JobPreview);

router.get('/login', UserLogin);
router.get('/register', UserRegister);

module.exports = router;
