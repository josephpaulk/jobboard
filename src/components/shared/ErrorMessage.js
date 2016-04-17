'use strict';

const React = require('react');

const ErrorMessage = React.createClass({
  render() {
    if (!this.props.message) { return null; }

    return (
      <div className="alert alert-danger" role="alert">{ this.props.message }</div>
    );
  }
});

module.exports = ErrorMessage;
