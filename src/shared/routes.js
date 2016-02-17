import React from 'react';
import pathToRegexp from 'path-to-regexp';
import { parseUri } from '../shared/utils';
import Homepage from '../components/Homepage';
import JobList from '../components/JobList';
import JobForm from '../components/JobForm';
import JobDetail from '../components/JobDetail';
import UserLogin from '../components/UserLogin';

// Super simple router since I could not get react-router rendering properly server-side
// @link https://www.npmjs.com/package/react-server-routing-example

exports.routes = {
  homepage: {
    url: '/',
    component: Homepage
  },

  // Users
  user_login: {
    url: '/login',
    component: UserLogin
  },

  // Jobs
  jobs_list: {
    url: '/jobs',
    component: JobList
  },
  jobs_create: {
    url: '/jobs/create',
    component: JobForm
  },
  jobs_views: {
    url: '/jobs/:id',
    component: JobDetail
  }
};

// A basic routing resolution function to go through each route and see if the
// given URL matches. If so we return the route key and data-fetching function
// the route's component has declared (if any)
exports.resolve = function(url) {
  for (var key in exports.routes) {
    var route = exports.routes[key]
    var keys = []
    var re = pathToRegexp(route.url, keys); // 'keys' will capture named parameters in route
    var match = re.exec(parseUri(url).path);

    if (match) {
      var params = {};
      if (keys.length > 0) {
        // Map extracted values back to named parameters in route from 'keys' (based on index position)
        match.slice(1).map(function (param, index) {
          params[keys[index].name] = param;
        });
      }
      var component = React.createFactory(route.component);
      return {
        key,
        params,
        component,
        fetchData: function() {
          if (!route.component.fetchData) {
            return Promise.resolve();
          }
          return route.component.fetchData.apply(null, params);
        }
      }
    }
  }
}
