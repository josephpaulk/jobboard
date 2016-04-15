'use strict';

const React = require('react');
const JobForm = require('components/JobForm');
const JobDetail = require('components/JobDetail');

const JobCreate = React.createClass({
  statics: {
    layout: 'job_create'
  },

  getInitialState() {
    return {
      job: {}
    };
  },

  onFormChange(job) {
    console.log(job);
    this.setState({ job });
  },

  render() {
    let job = this.state.job || {};

    return (
      <div className="row">
        <div className="col-md-5">
          <JobForm onChange={this.onFormChange} />
        </div>
        <div className="col-md-7">
          <JobDetail data={job} />
        </div>
      </div>
    );
  }
});

module.exports = JobCreate;
