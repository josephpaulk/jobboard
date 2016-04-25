'use strict';

const React = require('react');
const JobListingRow = require('components/JobListingRow');
const sdk = require('server/sdk');

const UserDashboard = React.createClass({
  statics: {
    title: 'User Dashboard',
    fetchData(params) {
      let user = params.user;
      return sdk.jobs().findByUserId(user.id);
    }
  },

  render() {
    let jobs = this.props.data || [];

    return (
      <div className="job-list">
        <h1>Your Job Listings</h1>
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
        <p>You have not created any job listings yet.</p>
        <p>Maybe consider <a href="/jobs/create">adding one?</a></p>
      </div>
    );
  }
});

module.exports = UserDashboard;
