'use strict';

const React = require('react');
const ErrorMessage = require('components/shared/ErrorMessage');
const sdk = require('server/sdk');
const Cookies = require('cookies-js');

const UserLogin = React.createClass({
  statics: {
    title: 'Login'
  },

  getInitialState() {
    return {
      data: {
        email: null,
        password: null
      },
      error_message: null,
      field_errors: {}
    }
  },

  onFormChange(e) {
    let data = Object.assign({}, this.state.data, {[e.target.name]: e.target.value})
    this.setState({ data });
  },

  onFormSubmit(e) {
    e.preventDefault();
    let data = this.state.data;

    sdk.users()
      .findByLogin(data.email, data.password)
      .then((user) => {
        // Set browser cookie with the result
        Cookies.set('user', JSON.stringify({ email: user.email, access_token: user.access_token }));
        window.location = '/user/dashboard';
      })
      .catch((err) => {
        this.setState({ error_message: err.message, field_errors: err.field_errors });
      });
  },

  render() {
    let getErrorClass = (field) => {
      return (this.state.field_errors && typeof this.state.field_errors[field] !== 'undefined') ? ' has-error' : '';
    };
    let showErrorMessage = (field) => {
      let msg = (this.state.field_errors && typeof this.state.field_errors[field] !== 'undefined') ? this.state.field_errors[field] : false;
      return msg ? <span className="field-error-message">{msg}</span> : '';
    };

    return (
      <form className="form-horizontal" onSubmit={this.onFormSubmit} onChange={this.onFormChange}>
        <fieldset>
          <legend>User Login</legend>
          <ErrorMessage message={this.state.error_message} />
          <div className={"form-group" + getErrorClass('email')}>
            <label htmlFor="email" className="col-lg-2 control-label">Email</label>
            <div className="col-lg-10">
              {showErrorMessage('email')}
              <input type="text" className="form-control" id="email" name="email" placeholder="user@example.com" />
            </div>
          </div>
          <div className={"form-group" + getErrorClass('password')}>
            <label htmlFor="password" className="col-lg-2 control-label">Password</label>
            <div className="col-lg-10">
              {showErrorMessage('password')}
              <input type="password" className="form-control" id="password" name="password" placeholder="Password" />
            </div>
          </div>
          <div className="form-group">
            <div className="col-lg-10 col-lg-offset-2">
              <button type="submit" className="btn btn-primary btn-lg">Login</button>
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
});

module.exports = UserLogin;
