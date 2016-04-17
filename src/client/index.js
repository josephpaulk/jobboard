'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const App = require('components/App')
const routes = require('shared/routes');

// Render current URL
let match = routes.match(window.location.href);
if (match) {
  let appInstance;
  let props = window.REACT_INITIAL_PROPS || match.props;
  // Error handler
  props.onError = function(err) {
    appInstance.setState({ error: err });
  };
  // Render as child of <App> component
  let jsxToRender = React.createElement(App, { children: match.factory(props) });
  appInstance = ReactDOM.render(jsxToRender, document.getElementById('content'));
} else {
  console.error('[Client] Oh noes! Route 404! :-(');
}
