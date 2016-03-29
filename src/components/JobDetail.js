'use strict';

const React = require('react');
const sdk = require('server/sdk');

class JobDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let job = this.props.data || {};

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{ job.title }</h3>
        </div>
        <div className="panel-body">
          <a href={`/jobs/${1}`}>
            { job.title }
          </a>
          <p>{ job.description }</p>
        </div>
      </div>
    );
  }

  static fetchData(props) {
    return sdk.jobs().findById(parseInt(props.id));
  }
}

module.exports = JobDetail;
