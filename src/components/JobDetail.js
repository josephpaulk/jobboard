'use strict';

const React = require('react');
const marked = require('marked');
const sdk = require('server/sdk');
const config = require('shared/config');
const dateFormat = require('dateformat');

const JobDetail = React.createClass({
  statics: {
    fetchData(props) {
      return sdk.jobs().findById(parseInt(props.id));
    }
  },

  render() {
    let user = this.props.user || false;
    let job = this.props.data || {};
    let job_date = job.dt_created ? new Date(job.dt_created) : new Date();
    let job_company_image = job.company_logo_url ? <a href={job.company_url}><img src={job.company_logo_url} alt={job.company_name} /></a> : '';
    let job_category = config.jobs.categories[job.category];
    let job_telecommute = config.jobs.telecommute[job.telecommute];

    return (
      <div className="job-detail">
        {this._renderAdminControls(job, user)}
        <header>
          <h1>{ job.title }</h1>
          <div className="job-date">Posted { dateFormat(job_date, "mmm dd") }</div>
        </header>
        <section>
          <div className="job-company">{ job.company_name } <mark>in { job.location }</mark></div>
        </section>
        <div className="panel panel-default">
          <div className="panel-body">
            <div className="pull-right">
              <table className="table job-meta-info">
                <tbody>
                  <tr>
                    <td>Category</td>
                    <td className="job-meta-info-value">{ job_category}</td>
                  </tr>
                  <tr>
                    <td>Work At:</td>
                    <td className="job-meta-info-value">{ job_telecommute }</td>
                  </tr>
                </tbody>
              </table>
              <div className="thumbnail text-center">
                { job_company_image }
                <div className="caption">
                  <h3><a className="job-company-link" href={job.company_url}>{ job.company_name }</a></h3>
                  <a className="btn btn-primary btn-lg" href={ job.apply_url }>Apply For This Job</a>
                </div>
              </div>
            </div>

            <div className="job-description" dangerouslySetInnerHTML={{__html: marked(job.description || '')}} />
          </div>
        </div>
      </div>
    );
  },

  _renderAdminControls(job, user) {
    if (job.user_id !== user.id && !user.is_admin) { return; }

    return (
      <div className="pull-right well job-admin-controls">
        <p>Admin Controls:</p>
        <a className="btn btn-default" href={`/jobs/${job.id}/edit`}>Edit</a> &nbsp;
        <a className="btn btn-danger" href="#">Delete</a>
      </div>
    );
  }
});

module.exports = JobDetail;
