'use strict';

const React = require('react');
const sdk = require('server/sdk');

class JobList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let jobs = this.props.data || [];

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Current Jobs</h3>
        </div>
        <div className="list-group">
          { jobs.length === 0 ? this._renderNoJobs() : undefined}
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
  }

  _renderNoJobs() {
    return (
      <div className="panel-body">
        <p>No jobs to show :-(.</p>
        <p>Maybe consider adding one?</p>
      </div>
    );
  }

  static fetchData(params) {
    return sdk.jobs().allActive();
  }
}

module.exports = JobList;
