'use strict';

const React = require('react');
const config = require('shared/config');

class JobForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let job = this.props.job || {};

    return (
      <div>
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
                { config.jobs.categories.map((categoryName) => {
                  return (
                    <div className="radio" key={ `category_${categoryName}` }>
                      <label>
                        <input type="radio" name="category" id={ `category_${categoryName}` } value={categoryName} checked="" />
                        { categoryName }
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>About the Company</legend>
            <div className="form-group">
              <label htmlFor="company_name" className="col-lg-2 control-label">Name</label>
              <div className="col-lg-10">
                <input type="text" className="form-control" id="company_name" />
                <span className="help-block">Your company or organization's name</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="company_logo_url" className="col-lg-2 control-label">Logo URL</label>
              <div className="col-lg-10">
                <input type="text" className="form-control" id="company_logo_url" />
                <span className="help-block">Optional &mdash; URL to your company logo - will be displayed with 200px width.</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="company_url" className="col-lg-2 control-label">Website URL</label>
              <div className="col-lg-10">
                <input type="text" className="form-control" id="company_url" />
                <span className="help-block">http://example.com/us/jobs</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="company_email" className="col-lg-2 control-label">Email</label>
              <div className="col-lg-10">
                <input type="text" className="form-control" id="company_email" />
                <span className="help-block">Where we'll send your reciept and confirmation email</span>
              </div>
            </div>
          </fieldset>

          <div className="form-group">
            <div className="col-lg-10 col-lg-offset-2">
              <button type="submit" className="btn btn-primary btn-lg">Continue to Step 2: Preview Ad</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

module.exports = JobForm;
