'use strict';

const React = require('react');
const JobForm = require('components/JobForm');
const JobDetail = require('components/JobDetail');

const JobCreate = React.createClass({
  statics: {
    layout: 'job_create',
    js: ['/js/simplemde.min.js'],
    css: ['/css/simplemde.min.css']
  },

  getInitialState() {
    return {
      job: this.props.job || {}
    };
  },

  onFormChange(job) {
    this.setState({ job });
  },

  render() {
    let job = this.state.job || {};
    let user = this.props.user || false;

    return (
      <div className="row">
        <div className="col-md-5">
          <JobForm onChange={this.onFormChange} job={job} user={user} />
        </div>
        <div className="col-md-7">
          <JobDetail data={job} />
        </div>
      </div>
    );
  }
});

module.exports = JobCreate;
