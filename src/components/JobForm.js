'use strict';

const React = require('react');
const ErrorMessage = require('components/shared/ErrorMessage');
const config = require('shared/config');
const sdk = require('server/sdk');

const JobForm = React.createClass({
  getInitialState() {
    let job = this.props.job || {};
    let user = this.props.user || {};

    return {
      data: {
        id: job.id || null,
        title: job.title || null,
        location: job.location || null,
        description: job.description || null,
        category: job.category || null,
        telecommute: job.telecommute || null,
        apply_url: job.apply_url || null,
        company_name: job.company_name || user.company_name || null,
        company_logo_url: job.company_logo_url || user.company_logo_url || null,
        company_url: job.company_url || user.company_url || null,
        company_email: job.company_email || user.company_email || null
      },
      error_message: null,
      field_errors: {}
    }
  },

  componentDidMount() {
    // SimpleMDE script and CSS are required in the 'views/job_create.ejs' layout to not bloat the bundle.js size
    var simplemde = new SimpleMDE({
      element: document.getElementById("description"),
      toolbar: ['bold', 'italic', 'heading-3', 'unordered-list', 'ordered-list', 'quote', 'code', 'link', 'guide']
    });

    // Update on change
    simplemde.codemirror.on("change", () => {
      this.onFormChange({ target: { name: 'description', value: simplemde.value() } });
    });
  },

  onFormChange(e) {
    let data = Object.assign({}, this.state.data, {[e.target.name]: e.target.value})
    this.setState({ data });
    this.props.onChange(data);
  },

  onFormSubmit(e) {
    e.preventDefault();
    let job = Object.assign({}, this.state.data);
    let action;

    // Can't send job id to create or update
    delete job.id;

    if (this.state.data.id) {
     action = sdk.jobs().update(this.state.data.id, job)
    } else {
     action = sdk.jobs().create(job)
    }

    action.then((job) => {
        window.location = '/jobs/' + job.id;
      })
      .catch((err) => {
        this.setState({ error_message: err.message, field_errors: err.field_errors });
      })
  },

  render() {
    let job = this.props.job || {};
    let user = this.props.user || {};
    let categories = config.jobs.categories;
    let telecommute = config.jobs.telecommute;

    let getErrorClass = (field) => {
      return (this.state.field_errors && typeof this.state.field_errors[field] !== 'undefined') ? ' has-error' : '';
    };
    let showErrorMessage = (field) => {
      let msg = (this.state.field_errors && typeof this.state.field_errors[field] !== 'undefined') ? this.state.field_errors[field] : false;
      return msg ? <span className="field-error-message">{msg}</span> : '';
    };

    return (
      <div className="job-form">
        <form className="form-vertical" onChange={this.onFormChange} onSubmit={this.onFormSubmit}>
          <fieldset>
            <legend>Post a New Job</legend>
            <ErrorMessage message={this.state.error_message} />
            <div className={"form-group" + getErrorClass('title')}>
              {showErrorMessage('title')}
              <label htmlFor="title" className="control-label">Job Title</label>
              <input type="text" className="form-control" id="title" name="title" value={job.title} />
              <span className="help-block">"Senior JavaScript Programmer" or "DevOps Engineer"</span>
            </div>
            <div className={"form-group" + getErrorClass('location')}>
              {showErrorMessage('location')}
              <label htmlFor="location" className="control-label">Location</label>
              <input type="text" className="form-control" id="location" name="location" value={job.location} />
              <span className="help-block">"Tulsa, OK" or "Oklahoma City, OK", etc.</span>
            </div>
            <div className={"form-group" + getErrorClass('description')}>
              {showErrorMessage('description')}
              <label htmlFor="description" className="control-label">Full Job Description</label>
              <textarea className="form-control" id="description" name="description" value={job.description} />
            </div>
            <div className={"form-group" + getErrorClass('category')}>
              {showErrorMessage('category')}
              <label className="control-label">Category</label>
              <select name="category" className="form-control" value={job.category}>
                <option value="">-- Select a Category --</option>
                { Object.keys(categories).map((categoryKey) => {
                  return <option key={ `category_${categoryKey}` } value={categoryKey}> { categories[categoryKey] } </option>;
                })}
              </select>
            </div>
            <div className={"form-group" + getErrorClass('telecommute')}>
              {showErrorMessage('telecommute')}
              <label className="control-label">Work Location</label>
              <select name="telecommute" className="form-control" value={job.telecommute}>
                <option value="">-- Select a Work Location --</option>
                { Object.keys(telecommute).map((key) => {
                  return <option key={ `remote_work_${key}` } value={key}> { telecommute[key] } </option>;
                })}
              </select>
            </div>
            <div className={"form-group" + getErrorClass('apply_url')}>
              {showErrorMessage('apply_url')}
              <label htmlFor="apply_url" className="control-label">Job Application URL</label>
              <input type="text" className="form-control" id="apply_url" name="apply_url" value={job.apply_url} />
              <span className="help-block">http://example.com/us/jobs/4281/apply</span>
            </div>
          </fieldset>

          <fieldset>
            <legend>About the Company</legend>
            <div className={"form-group" + getErrorClass('company_name')}>
              {showErrorMessage('company_name')}
              <label htmlFor="company_name" className="control-label">Company Name</label>
              <input type="text" className="form-control" id="company_name" name="company_name" value={job.company_name || user.company_name} />
              <span className="help-block">Your company or organization's name</span>
            </div>
            <div className={"form-group" + getErrorClass('company_logo_url')}>
              {showErrorMessage('company_logo_url')}
              <label htmlFor="company_logo_url" className="control-label">Company Logo URL</label>
              <input type="text" className="form-control" id="company_logo_url" name="company_logo_url" value={job.company_logo_url || user.company_logo_url} />
              <span className="help-block">Optional &mdash; URL to your company logo - will be displayed with 200px width.</span>
            </div>
            <div className={"form-group" + getErrorClass('company_url')}>
              {showErrorMessage('company_url')}
              <label htmlFor="company_url" className="control-label">Company Website URL</label>
              <input type="text" className="form-control" id="company_url" name="company_url" value={job.company_url || user.company_url} />
              <span className="help-block">http://example.com</span>
            </div>
            <div className={"form-group" + getErrorClass('company_email')}>
              {showErrorMessage('company_email')}
              <label htmlFor="company_email" className="control-label">Company Email</label>
              <input type="text" className="form-control" id="company_email" name="company_email" value={job.company_email || user.company_email} />
              <span className="help-block">Where we'll send your reciept and confirmation email</span>
            </div>
          </fieldset>

          <div className="form-group">
            <button type="submit" className="btn btn-primary btn-lg">Submit Job For Approval</button>
          </div>
          <p><small>All jobs postings are FREE and manually approved for a limited time.</small></p>
        </form>
      </div>
    );
  }
});

module.exports = JobForm;
