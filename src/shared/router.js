'use strict';

let React = require('react');
let pathToRegexp = require('path-to-regexp');

class Router {
  constructor() {
    this.routes = [];
  }

  /**
   * GET route
   *
   * @param {String} pattern - Express.js style route pattern or bare URL string
   * @param {React.Component} component
   */
  get(pattern, component) {
    // Store in internal routes
    this.routes.push({
      pattern,
      component
    });
  }

  /**
   * Match URL to given routes
   *
   * @param {String} url
   */
  match(url) {
    let urlParts = parseUri(url);
    let routesLen = this.routes.length;
    for(let i = 0; i < routesLen; i++) {
      let route = this.routes[i];

      let keys = []
      let re = pathToRegexp(route.pattern, keys); // 'keys' will capture named parameters in route
      let match = re.exec(urlParts.path);

      if (match) {
        let props = {};
        if (keys.length > 0) {
          // Map extracted values back to named parameters in route from 'keys' (based on index position)
          match.slice(1).map(function (param, index) {
            props[keys[index].name] = param;
          });
        }

        // Execute route
        let component = route.component;
        var factory = React.createFactory(component);
        return {
          component,
          pattern: route.pattern,
          props,
          factory,
          urlParts,
          fetchData: function(staticProps) {
            if (!component.fetchData) {
              return Promise.resolve();
            }
            return component.fetchData.call(null, staticProps);
          }
        };
      }
    }

    return false;
  }
}

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
// @link http://blog.stevenlevithan.com/archives/parseuri
function parseUri(str) {
  var o   = parseUri.options,
    m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
    uri = {},
    i   = 14;

  while (i--) uri[o.key[i]] = m[i] || "";

  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) uri[o.q.name][$1] = $2;
  });

  return uri;
};
parseUri.options = {
  strictMode: false,
  key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
  q:   {
    name:   "queryKey",
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};

module.exports = Router;
