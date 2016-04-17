'use strict';

// Babel register ONLY for 'components' folder so there is no compile step
require("babel-register")({
  presets: ['react'],
  only: /components/,
  extensions: [".jsx", ".js"]
});

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const express = require('express');
const bodyParser = require('body-parser');
// const passport = require('passport');

const routes = require('shared/routes');
const sdk = require('server/sdk');

// React components
const App = require('components/App');
const JobCreate = require('components/JobCreate');
const Error404 = require('components/Error404');

let app = express();
let isDevEnv = process.env.NODE_ENV === 'development';

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Parse body params
app.use(bodyParser.json())
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

// Match shared routes rendered by React components
app.get('*', function(req, res) {
  let match = routes.match(req.url);
  if (match) {
    // Add query string data to serverProps for fetchData
    let serverProps = Object.assign({}, match.props, {
      url: match.urlParts.path,
      queryString: match.urlParts.queryKey
    });

    // Fetch data server side
    match.fetchData(serverProps)
      .then(function (data) {
        let props = {
          data,
          qs: match.urlParts.queryKey
        };
        let component = match.component;
        let layout = component.layout || 'layout';
        let jsxToRender = React.createElement(App, { children: [component] });
        res.render(layout, {
          content: ReactDOMServer.renderToString(jsxToRender),
          js: component.js || [],
          css: component.css || [],
          react_props: JSON.stringify(props)
        });
      }).catch(function (err) {
        // @TODO: Create error template to show errors in
        if (isDevEnv) {
          console.log(err, err.stack.split('\n'));
        }

        res.status(500).render('layout', {
          content: err,
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
      react_props: JSON.stringify({})
    });
  }
});

// Post new job
app.post('/api/jobs', function (req, res) {
  console.log(req);

  sdk.jobs()
    .create(req.body)
    .then(function(job) {
      res.json({ job });
    })
    .catch(sdk.respondWithError(req, res));
});

/**
 * @TODO: User Accounts
 *
 * I was originally going to create user accounts, logins, etc. but then I
 * decided against it in favor of making the job board *really* simple so it
 * could be launched sooner rather than later. - Vance L
 */


// Configure Passport for user authentication
// passport.use(User.passportTokenStrategy());
// passport.use(User.passportLoginStrategy());

// app.post('/login',
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.json({ user: req.user });
//   }
// );
//
// app.post('/login',
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.json({ user: req.user });
//   }
// );
//
// app.get('/access_token',
//   passport.authenticate('bearer', { session: false }),
//   function(req, res) {
//     res.json({ user: req.user });
//   }
// );

// Start server
let server = app.listen(process.env.PORT || 1339, function () {
  let host = server.address().address;
  let port = server.address().port;

  if (host === '::') {
    host = 'localhost';
  }

  console.log('Example app listening at http://%s:%s', host, port);
});
