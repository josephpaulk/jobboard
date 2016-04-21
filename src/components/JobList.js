'use strict';

const React = require('react');
const JobListingRow = require('components/JobListingRow');
const sdk = require('server/sdk');

const JobList = React.createClass({
  statics: {
    fetchData(params) {
      return sdk.jobs().allActive();
    }
  },

  render() {
    let jobs = this.props.data || [];

    return (
      <div className="job-list">
        <h1>Oklahoma Tech Jobs</h1>
        <div className="panel panel-default">
          <div className="list-group">
            { jobs.length === 0 ? this._renderNoJobs() : undefined}
            { jobs.map(function (job) {
              return <JobListingRow job={job} key={'job_' + job.id} />;
            })}
          </div>
        </div>
      </div>
    );
  },

  _renderNoJobs() {
    return (
      <div className="panel-body">
        <p>No jobs to show :-(.</p>
        <p>Maybe consider <a href="/jobs/create">adding one?</a></p>
      </div>
    );
  }
});

module.exports = JobList;
