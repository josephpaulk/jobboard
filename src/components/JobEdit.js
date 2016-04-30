'use strict';

const React = require('react');
const JobCreate = require('components/JobCreate');
const sharedUtils = require('shared/utils');
const errors = require('shared/errors');
const sdk = require('server/sdk');

const JobEdit = React.createClass({
  statics: {
    layout: JobCreate.layout,
    js: JobCreate.js,
    css: JobCreate.css,
    fetchData(props) {
      let user = props.user;
      return sdk.jobs().findById(parseInt(props.id)).then((job) => {
        if (!sharedUtils.userCanEditJob(user, job)) {
          throw new errors.Forbidden("User is not allowed to edit this job listing");
        }

        return job;
      });
    }
  },

  render() {
    let user = this.props.user || false;
    let job = this.props.data || {};

    return <JobCreate user={user} job={job} />;
  }
});

module.exports = JobEdit;
