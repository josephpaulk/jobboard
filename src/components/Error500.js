const React = require('react');

const Error500 = function (props) {
  return (
    <div>
      <h1>Error 500</h1>
      <h2>{ props.error.message }</h2>
      <p>This is a server error - it means we did something wrong - not you.</p>
    </div>
  );
};
Error500.title = 'Error!';

module.exports = Error500;
