'use strict';

const React = require('react');
const JobList = require('components/JobList');

class Homepage extends React.Component {
  render() {
    return (
      <div>
        <p>Hello world!</p>
        <JobList {...this.props} />
      </div>
    );
  }

  static fetchData(params) {
    return JobList.fetchData(params);
  }
}

module.exports = Homepage;
