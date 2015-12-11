import React from 'react';
import JobList from './JobList';

export default class Homepage extends React.Component {
  render() {
    return (
      <div>
        <p>Hello world!</p>
        <JobList />
      </div>
    );
  }
}
