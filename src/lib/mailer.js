'use strict';

const path = require('path');
const ejs = require('ejs');
const validator = require('server/validator');
const fetch = require('isomorphic-fetch');
let _templates = {};

/**
 * Send email with specified template
 *
 * @return Promise
 */
function sendTemplate(templateKey, data, mailOptions) {
  let templateFn = _templates[templateKey];

  if (typeof templateFn === 'undefined') {
    throw new Error("Cannot find template by key '" + templateKey + "'");
  }

  return templateFn.render(data)
    .then(result => {
      let options = Object.assign(templateFn.mailOptions, mailOptions, {
        html: result
      });

      // console.log('Rendered template! ', data, result);
      return send(options);
    });
}

/**
 * Add email template
 */
function addTemplate(templateKey, dataSchema, mailOptions) {
  // let templateFileName = templateKey.replace(/\./g, '-');
  let templateFile = path.join(__dirname, '../../views/emails/' + templateKey.replace(/\./g, '-') + '.ejs');
  let templateFn = function _renderTemplateWithData(data) {
    return validator.params(data, dataSchema).then(params => {
      return new Promise((resolve, reject) => {
        ejs.renderFile(templateFile, data, (err, result) => {
          if (err) {
            return reject(err);
          }

          return resolve(result);
        });
      });
    });
  };

  return _templates[templateKey] = {
    render: templateFn,
    mailOptions
  };
}

/**
 * Send email
 *
 * @return Promise
 */
function send(options) {
  let mailOptions = Object.assign({
    from: process.env.FROM_EMAIL
  }, options);

  // Send email via Mailgun API
  return fetch(process.env.MAILGUN_API_URL + '/messages', {
      body: JSON.stringify(mailOptions),
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic ' + new Buffer('api:' + process.env.MAILGUN_API_KEY).toString('base64'),
        'Content-Type': 'application/json',
      },
      method: 'post'
    })
    .then(res => {
      return res.json().then(json => {
        if (res.status >= 400) {
          throw new Error('Mail Error: ' + json.message);
        }
      });
    });
}

module.exports = { addTemplate, send, sendTemplate };
