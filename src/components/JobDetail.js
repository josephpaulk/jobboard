'use strict';

const React = require('react');
const marked = require('marked');
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
          <span className="label label-default">{ job.location }</span>
          <div dangerouslySetInnerHTML={{__html: marked(job.description || '')}} />
        </div>
      </div>
    );
  }

  static fetchData(props) {
    return sdk.jobs().findById(parseInt(props.id));
  }
}

module.exports = JobDetail;
