'use strict';

let React = require('react');

let App = React.createClass({
  getInitialState() {
    return {
      error: null
    };
  },

  clearErrorTimeout() {
    setTimeout(() => this.setState({ error: null }), 2000);
  },

  render() {
    let errorMessage;

    // Show error message if set
    if (this.state.error) {
      errorMessage = <div className="appError">
        <div className="alert alert-danger" role="alert">
          Error: {this.state.error.message}
        </div>
      </div>;
      this.clearErrorTimeout();
    }

    return (
      <div id="app">
        {errorMessage}
        {this.props.children}
      </div>
    );
  }
});

module.exports = App;
