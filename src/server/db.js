const knex = require('knex');

module.exports = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: 'joblahoma,public'
});
