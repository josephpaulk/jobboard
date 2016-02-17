import React from 'react';

export default class JobList extends React.Component {
  constructor() {
    super();
    this.state = {
      jobs: []
    };
  }

  render() {
    return (
      <a href={`/jobs/${1}`}>
        Job Listing Title
      </a>
    );
  }
}
