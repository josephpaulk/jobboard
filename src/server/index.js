'use strict';

// Babel register ONLY for 'components' folder so there is no compile step for
// rendering React components on the server
require("babel-register")({
  presets: ['react'],
  only: /components/,
  extensions: [".jsx", ".js"]
});

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const express = require('express');
const bodyParser = require('body-parser');

const routes = require('shared/routes');
const sdk = require('server/sdk');

// React components
const App = require('components/App');
const JobCreate = require('components/JobCreate');
const Error404 = require('components/Error404');

let app = express();
let isDevEnv = process.env.NODE_ENV === 'development';

// Ensure required ENV vars are set
let requiredEnv = ['DATABASE_URL', 'NODE_ENV', 'COOKIE_SECRET', 'JOBS_DAYS_TO_EXPIRE', 'USER_TOKEN_DAYS_TO_EXPIRE'];
let unsetEnv = requiredEnv.filter(function (env) { return !(typeof process.env[env] !== 'undefined'); });
if (unsetEnv.length > 0) {
  throw new Error("Required ENV variables are not set: [" + unsetEnv.join(', ') + "]");
}

// Express config
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Parse body params
app.use(bodyParser.json())
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

// Cookies
let cookieParser = require('cookie-parser');
app.use(cookieParser(process.env.COOKIE_SECRET));

/**
 * User authentication if access_token is provided
 *
 * Set 'req.user' as user object if we have an access_token
 */
function userAuthRequired(req, res, next) {
  let access_token;

  // Cookie auth
  if (req.cookies.user) {
    let userCookieValue = JSON.parse(req.cookies.user);
    if (userCookieValue.access_token) {
      access_token = userCookieValue.access_token;
    }
  }

  if (access_token) {
    sdk.users()
      .findByToken(access_token)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch(sdk.respondWithError(req, res));
  } else {
    throw new errors.NotAuthorized("User login required");
  }
}

// Passthru auth & calls next() to load 'req.user' as found user object
app.get('/users/dashboard', userAuthRequired);

// Post new job
app.post('/api/jobs', userAuthRequired, function (req, res) {
  let params = Object.assign({}, req.body, { user_id: req.user.id });
  sdk.jobs()
    .create(params)
    .then(function(job) {
      res.json({ job });
    })
    .catch(sdk.respondWithError(req, res));
});

app.post('/api/users/login', function(req, res) {
  sdk.users()
    .findByLogin(req.body.email, req.body.password)
    .then((user) => {
      res.json({ user });
    })
    .catch(sdk.respondWithError(req, res));
});

app.post('/api/users/register', function (req, res) {
  sdk.users()
    .register(req.body)
    .then(function(user) {
      res.json({ user });
    })
    .catch(sdk.respondWithError(req, res));
});

function renderComponentWithLayout(res, renderFunc, component, props = {}, layout = 'layout') {
  let jsxToRender = React.createElement(App, { children: renderFunc() });
  res.render(component.layout || layout, {
    content: ReactDOMServer.renderToString(jsxToRender),
    title: component.title,
    js: component.js || [],
    css: component.css || [],
    react_props: JSON.stringify(props)
  });
}

// Match shared routes rendered by React components
app.get('*', function(req, res) {
  let match = routes.match(req.url);
  if (match) {
    // Add query string data to serverProps for fetchData
    let serverProps = Object.assign({}, match.props, {
      url: match.urlParts.path,
      queryString: match.urlParts.queryKey,
      user: req.user || false
    });

    // Fetch data server side
    match.fetchData(serverProps)
      .then(function (data) {
        let props = {
          data,
          qs: match.urlParts.queryKey,
          user: req.user || false
        };
        let component = match.component;
        renderComponentWithLayout(res, () => match.factory(props), component, props);
      }).catch(function (err) {
        // @TODO: Create error template to show errors in
        if (isDevEnv) {
          console.log(err, err.stack.split('\n'));
        }

        res.status(500).render('layout', {
          content: err,
          title: 'Error',
          js: [],
          css: [],
          react_props: JSON.stringify({})
        });
      });
  } else {
    // Show 404 route
    let content = ReactDOMServer.renderToString(React.createElement(Error404));
    res.status(404).render('layout', {
      content,
      title: 'Not Found',
      js: [],
      css: [],
      react_props: JSON.stringify({})
    });
  }
});

// Start server
let server = app.listen(process.env.PORT || 1339, function () {
  let host = server.address().address;
  let port = server.address().port;

  if (host === '::') {
    host = 'localhost';
  }

  console.log('Example app listening at http://%s:%s', host, port);
});
