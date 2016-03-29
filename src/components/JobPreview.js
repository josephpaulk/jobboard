'use strict';

const React = require('react');
const config = require('shared/config');

class JobForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let job = this.props.job || {};
    let categories = config.jobs.categories;
    let telecommute = config.jobs.telecommute;

    return (
      <div>
        Job Listing Preview
      </div>
    );
  }
}

module.exports = JobForm;

