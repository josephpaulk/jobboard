import React from 'react';
import { Router, Route, Link } from 'react-router';

import Homepage from './Homepage';
import JobList from './JobList';
import JobDetail from './JobDetail';
import Error404 from './Error404';

export default class Routes extends React.Component {
  render() {
    return <Router>
        <Route path="/" component={Homepage}>
        <Route path="jobs" component={JobList}>
        <Route path="/jobs/:id" component={JobDetail}/>
        </Route>
        <Route path="*" component={Error404}/>
        </Route>
      </Router>;
  }
};
