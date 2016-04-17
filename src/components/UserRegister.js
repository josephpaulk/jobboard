'use strict';

const React = require('react');
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
        password: null
      },
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
        this.setState({ field_errors: err.field_errors });
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
          <div className="form-group">
            <div className="col-lg-10 col-lg-offset-2">
               <button type="submit" className="btn btn-primary btn-lg">Register</button>
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
});

module.exports = UserRegister;
