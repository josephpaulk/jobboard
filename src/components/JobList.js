import React from 'react';

export default class JobList extends React.Component {
  constructor(props) {
    super();
    this.state = {
      jobs: props.jobs || []
    };
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Current Jobs</div>
        <div className="panel-body">
          Panel content
        </div>
        <ul className="list-group">
          { this.state.jobs.map(function (job) {
            return <li className="list-group-item" key={job.id}><a href={`/jobs/${job.id}`}>{ job.name }</a></li>;
          })}
        </ul>
      </div>
    );
  }

  static fetchData(params) {
    let jobs = [
      {
        id: 1,
        name: 'Director of Awesomesauce',
        location: 'Tulsa, OK'
      }
    ];

    return Promise.resolve({ jobs });
  }
}
