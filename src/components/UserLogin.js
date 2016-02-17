import React from 'react';

export default class UserLogin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <form className="form-horizontal">
        <fieldset>
          <legend>User Login</legend>
          <div className="form-group">
            <label htmlFor="inputEmail" className="col-lg-2 control-label">Email</label>
            <div className="col-lg-10">
              <input type="text" className="form-control" id="inputEmail" placeholder="Email" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="inputPassword" className="col-lg-2 control-label">Password</label>
            <div className="col-lg-10">
              <input type="password" className="form-control" id="inputPassword" placeholder="Password" />
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
