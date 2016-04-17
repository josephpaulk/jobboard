'use strict';

const React = require('react');

const JobListingRow = React.createClass({
  render() {
    let job = this.props.job;

    return (
      <a className="list-group-item" key={job.id} href={`/jobs/${job.id}`}>
        <div className="pull-right">{ job.location }</div>
        { job.title }
      </a>
    );
  }
});

module.exports = JobListingRow;

