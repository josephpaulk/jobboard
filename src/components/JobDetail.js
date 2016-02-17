import React from 'react';

export default class JobList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let job = this.props.job || {};

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{ job.title }</h3>
        </div>
        <div className="panel-body">
          <a href={`/jobs/${1}`}>
            { job.title }
          </a>
          [ Job description here... ]
        </div>
      </div>
    );
  }
}
