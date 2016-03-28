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
const passport = require('passport');

const User = require('model/user');
const router = require('shared/routes');
const Error404 = require('components/Error404');

let app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Configure Passport for user authentication
passport.use(User.passportTokenStrategy());
passport.use(User.passportLoginStrategy());

// Render React components server-side
app.get('/*', function (req, res) {
  let route = router.resolve(req.url);
  if (route) {
    // Call route 'fetchData' method to pre-load all data
    route.fetchData(route.params).then(function(props) {
      let component = route.component(props);
      let content = ReactDOMServer.renderToString(component);
      res.status(200).render('layout', { content: content });

    // Handle errors
    }).catch(function (err) {
      res.status(500).send(err.message)
    });
  } else {
    // Show 404 route
    let content = ReactDOMServer.renderToString(React.createElement(Error404));
    res.status(404).render('layout', { content: content });
  }
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.json({ user: req.user });
  }
);

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.json({ user: req.user });
  }
);

app.get('/access_token',
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.json({ user: req.user });
  }
);

// Start server
let server = app.listen(process.env.PORT || 1339, function () {
  let host = server.address().address;
  let port = server.address().port;

  if (host === '::') {
    host = 'localhost';
  }

  console.log('Example app listening at http://%s:%s', host, port);
});
