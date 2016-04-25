'use strict';

const React = require('react');
const ErrorMessage = require('components/shared/ErrorMessage');
const sdk = require('server/sdk');

const UserRegister = React.createClass({
  statics: {
    title: 'Register New User'
  },

  getInitialState() {
    return {
      data: {
        name: null,
        email: null,
        password: null,
        company_name: null,
        company_url: null,
        company_logo_url: null,
        company_email: null
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

    sdk.users()
      .register(this.state.data)
      .then((job) => {
        alert('Your user account has been created!');
        window.location = '/';
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
      <form className="form-horizontal" method="POST" action="/register" onChange={this.onFormChange} onSubmit={this.onFormSubmit}>
        <fieldset>
          <legend>Register New User</legend>
          <ErrorMessage message={this.state.error_message} />
          <div className={"form-group" + getErrorClass('name')}>
            <label htmlFor="name" className="col-lg-2 control-label">Name</label>
            <div className="col-lg-10">
              {showErrorMessage('name')}
              <input type="text" className="form-control" id="name" name="name" placeholder="Full Name" />
            </div>
          </div>
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
        </fieldset>

          <fieldset>
            <legend>About the Company</legend>
            <p>These fields are optional, but can help you create job ads
            faster because they will be pre-populated on each job listing form
            if filled in.</p>
            <div className={"form-group" + getErrorClass('company_name')}>
              {showErrorMessage('company_name')}
              <label htmlFor="company_name" className="col-lg-2 control-label">Company Name</label>
              <div className="col-lg-10">
                <input type="text" className="form-control" id="company_name" name="company_name" />
                <span className="help-block">Your company or organization's name</span>
              </div>
            </div>
            <div className={"form-group" + getErrorClass('company_logo_url')}>
              {showErrorMessage('company_logo_url')}
              <label htmlFor="company_logo_url" className="col-lg-2 control-label">Company Logo URL</label>
              <div className="col-lg-10">
                <input type="text" className="form-control" id="company_logo_url" name="company_logo_url" />
                <span className="help-block">Optional &mdash; URL to your company logo - will be displayed with 200px width.</span>
              </div>
            </div>
            <div className={"form-group" + getErrorClass('company_url')}>
              {showErrorMessage('company_url')}
              <label htmlFor="company_url" className="col-lg-2 control-label">Company Website URL</label>
              <div className="col-lg-10">
                <input type="text" className="form-control" id="company_url" name="company_url" />
                <span className="help-block">http://example.com</span>
              </div>
            </div>
            <div className={"form-group" + getErrorClass('company_email')}>
              {showErrorMessage('company_email')}
              <label htmlFor="company_email" className="col-lg-2 control-label">Company Email</label>
              <div className="col-lg-10">
                <input type="text" className="form-control" id="company_email" name="company_email" />
                <span className="help-block">Where we'll send your reciept and confirmation email</span>
              </div>
            </div>
          </fieldset>

        <div className="form-group">
          <div className="col-lg-10 col-lg-offset-2">
             <button type="submit" className="btn btn-primary btn-lg">Register</button>
          </div>
        </div>
      </form>
    );
  }
});

module.exports = UserRegister;
