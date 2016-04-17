'use strict';

const React = require('react');
const sdk = require('server/sdk');

const UserDashboard = React.createClass({
  statics: {
    title: 'User Dashboard',
    fetchData(params) {
      // @TODO: Get jobs only for current logged-in user
      return sdk.jobs().allActive();
    }
  },

  render() {
    let jobs = this.props.data || [];

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Your Job Listings</h3>
        </div>
        <div className="list-group">
          { jobs.length === 0 ? this._renderNoJobs() : null }
          { jobs.map(function (job) {
            return (
              <a className="list-group-item" key={job.id} href={`/jobs/${job.id}`}>
                <div className="pull-right">{ job.location }</div>
                { job.title }
              </a>
            );
          })}
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
