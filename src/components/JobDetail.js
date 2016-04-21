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
    let job = this.props.data || {};
    let job_date = new Date(job.dt_created);
    let job_company_image = job.company_logo_url ? <a href={job.company_url}><img src={job.company_logo_url} alt={job.company_name} /></a> : '';
    let job_category = config.jobs.categories[job.category];
    let job_telecommute = config.jobs.telecommute[job.telecommute];

    return (
      <div className="row job-detail">
        <div className="col-md-9">
          <header>
            <h1>{ job.title }</h1>
            <div className="job-date">Posted { dateFormat(job_date, "mmm dd") }</div>
          </header>
          <section>
            <div className="job-company">{ job.company_name } <mark>in { job.location }</mark></div>
          </section>
          <div className="panel panel-default">
            <div className="panel-body">
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

              <div className="job-description" dangerouslySetInnerHTML={{__html: marked(job.description || '')}} />
            </div>
          </div>
        </div>
        <div className="col-md-3 job-company-info">
          { job_company_image }
          <p><a className="job-company-link" href={job.company_url}>{ job.company_name }</a></p>
          <a className="btn btn-primary btn-lg" href={ job.apply_url }>Apply For This Job</a>
        </div>
      </div>
    );
  }
});

module.exports = JobDetail;
