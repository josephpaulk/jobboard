'use strict';

const React = require('react');

class UserLogin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <form className="form-horizontal" method="POST" action="/login">
        <fieldset>
          <legend>User Login</legend>
          <div className="form-group">
            <label htmlFor="email" className="col-lg-2 control-label">Email</label>
            <div className="col-lg-10">
              <input type="text" className="form-control" id="email" name="email" placeholder="user@example.com" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password" className="col-lg-2 control-label">Password</label>
            <div className="col-lg-10">
              <input type="password" className="form-control" id="password" name="password" placeholder="Password" />
              <div className="checkbox">
                <label>
                  <input type="checkbox" /> Remember Me
                </label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="col-lg-10 col-lg-offset-2">
              <button type="submit" className="btn btn-primary btn-lg">Login</button>
              <button type="reset" className="btn btn-link">Cancel</button>
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
}

module.exports = UserLogin;
