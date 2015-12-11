import React from 'react';
import { match, RouterContext } from 'react-router';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import passport from 'passport';

import Homepage from './components/Homepage';
import User from './model/user';
import Routes from './components/Routes';
import Error404 from './components/Error404';

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
  match({ routes: Routes, location: req.url }, (error, redirectLocation, renderProps) => {
    console.log(req.url);

    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      let content = ReactDOMServer.renderToString(<RouterContext {...renderProps} />);
      res.status(200).render('layout', { content: content });
    } else {
      let content = ReactDOMServer.renderToString(<Error404 />);
      res.status(404).render('layout', { content: content });
    }
  });
});

// GET /
// app.get('/', function (req, res) {
//   res.render('layout', {
//     content: ReactDOMServer.renderToString(<Homepage />)
//   });
// });

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
