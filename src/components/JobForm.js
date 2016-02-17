import React from 'react';

export default class JobForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let job = this.props.job || {};

    return (
      <form className="form-horizontal">
        <fieldset>
          <legend>Post a New Job</legend>
          <div className="form-group">
            <label htmlFor="title" className="col-lg-2 control-label">Job Title</label>
            <div className="col-lg-10">
              <input type="text" className="form-control" id="title" />
              <span className="help-block">"Senior JavaScript Programmer" or "DevOps Engineer"</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="location" className="col-lg-2 control-label">Location</label>
            <div className="col-lg-10">
              <input type="text" className="form-control" id="location" />
              <span className="help-block">"Tulsa, OK" or "Oklahoma City, OK", etc.</span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description" className="col-lg-2 control-label">Job Description</label>
            <div className="col-lg-10">
              <textarea className="form-control" rows="3" id="description"></textarea>
              <span className="help-block">Full description of your job listing. Markdown supported.</span>
            </div>
          </div>
          <div className="form-group">
            <label className="col-lg-2 control-label">Category</label>
            <div className="col-lg-10">
              <div className="radio">
                <label>
                  <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked="" />
                  Option one is this
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" name="optionsRadios" id="optionsRadios2" value="option2" />
                  Option two can be something else
                </label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="col-lg-10 col-lg-offset-2">
              <button type="submit" className="btn btn-primary btn-lg">Continue to Step 2: Preview Ad</button>
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
}
