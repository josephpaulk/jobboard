'use strict';

const React = require('react');
const config = require('shared/config');

const JobListingRow = React.createClass({
  render() {
    let job = this.props.job;
    let job_category = config.jobs.categories[job.category];

    return (
      <a className="list-group-item" key={job.id} href={`/jobs/${job.id}`}>
        <div className="pull-right">
          <span>{ job.location }</span>
          <span className="label label-default">{ job_category }</span>
        </div>
        <span className="job-company">{ job.company_name }</span>
        { job.title }
      </a>
    );
  }
});

module.exports = JobListingRow;

