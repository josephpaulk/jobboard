import React from 'react';
import { Link } from 'react-router';

export default class JobList extends React.Component {
  constructor() {
    super();
    this.state = {
      jobs: []
    };
  }

  render() {
    return (
      <Link href={`/jobs/${1}`}>
        Job Listing Title
      </Link>
    );
  }
}
