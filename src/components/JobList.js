import React from 'react';

export default class JobList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: props.jobs || []
    };
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Current Jobs</h3>
        </div>
        <div className="list-group">
          { this.props.jobs.map(function (job) {
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

  static fetchData(params) {
    let jobs = [
      {
        id: 1,
        title: 'Director of Awesomesauce',
        location: 'Tulsa, OK'
      }
    ];

    return Promise.resolve({ jobs });
  }
}
