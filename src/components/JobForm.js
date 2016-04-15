'use strict';

const React = require('react');
const config = require('shared/config');

const JobForm = React.createClass({
  getInitialState() {
    return {
      title: null,
      location: null,
      description: null,
      category: null,
      telecommute: null,
      company_name: null,
      company_logo_url: null,
      company_url: null,
      company_email: null
    }
  },

  onFormChange(e) {
    console.log('> Form onChange()');
    let state = Object.assign({}, this.state, {[e.target.name]: e.target.value})
    this.setState(state);
    this.props.onChange(state);
  },

  render() {
    let job = this.props.job || {};
    let categories = config.jobs.categories;
    let telecommute = config.jobs.telecommute;

    return (
      <div className="job-form">
        <form className="form-horizontal" method="post" action="/jobs" onChange={this.onFormChange}>
          <fieldset>
            <legend>Post a New Job</legend>
            <div className="form-group">
              <label htmlFor="title" className="col-lg-2 control-label">Job Title</label>
              <div className="col-lg-10">
                <input type="text" className="form-control" id="title" name="title" />
                <span className="help-block">"Senior JavaScript Programmer" or "DevOps Engineer"</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="location" className="col-lg-2 control-label">Location</label>
              <div className="col-lg-10">
                <input type="text" className="form-control" id="location" name="location" />
                <span className="help-block">"Tulsa, OK" or "Oklahoma City, OK", etc.</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description" className="col-lg-2 control-label">Job Description</label>
              <div className="col-lg-10">
                <textarea className="form-control" id="description" name="description" value={this.state.description} />
                <span className="help-block">Full description of your job listing. Markdown supported.</span>
              </div>
            </div>
            <div className="form-group">
              <label className="col-lg-2 control-label">Category</label>
              <div className="col-lg-10">
                <select name="category">
                  { Object.keys(categories).map((categoryKey) => {
                    return <option key={ `category_${categoryKey}` } value={categoryKey}> { categories[categoryKey] } </option>;
                  })}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="col-lg-2 control-label">Work Location</label>
              <div className="col-lg-10">
                <select name="telecommute">
                  { Object.keys(telecommute).map((key) => {
                    return <option key={ `remote_work_${key}` } value={key}> { telecommute[key] } </option>;
                  })}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>About the Company</legend>
            <div className="form-group">
              <label htmlFor="company_name" className="col-lg-2 control-label">Company Name</label>
              <div className="col-lg-10">
                <input type="text" className="form-control" id="company_name" name="company_name" />
                <span className="help-block">Your company or organization's name</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="company_logo_url" className="col-lg-2 control-label">Company Logo URL</label>
              <div className="col-lg-10">
                <input type="text" className="form-control" id="company_logo_url" name="company_logo_url" />
                <span className="help-block">Optional &mdash; URL to your company logo - will be displayed with 200px width.</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="company_url" className="col-lg-2 control-label">Company Website URL</label>
              <div className="col-lg-10">
                <input type="text" className="form-control" id="company_url" name="company_url" />
                <span className="help-block">http://example.com/us/jobs</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="company_email" className="col-lg-2 control-label">Company Email</label>
              <div className="col-lg-10">
                <input type="text" className="form-control" id="company_email" name="company_email" />
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
});

module.exports = JobForm;
