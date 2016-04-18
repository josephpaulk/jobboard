'use strict';

const React = require('react');
const JobList = require('components/JobList');

const Homepage = React.createClass({
  statics: {
    title: 'Oklahoma Tech Jobs',
    fetchData(params) {
      return JobList.fetchData(params);
    }
  },

  render() {
    return (
      <div>
        <JobList {...this.props} />
      </div>
    );
  }
});

module.exports = Homepage;
