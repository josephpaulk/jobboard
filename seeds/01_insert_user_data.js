'use strict';

const bcrypt = require('bcryptjs');

exports.seed = function(knex, Promise) {
  let now = new Date();
  let hashedPassword = bcrypt.hashSync('password', 10);

  // Deletes ALL existing entries
  return Promise.join(
      knex.raw("TRUNCATE TABLE users CASCADE"),
      knex.raw("TRUNCATE TABLE jobs CASCADE")
    ).then(_ => Promise.join(
      knex.raw("SELECT setval(pg_get_serial_sequence('users', 'id'), coalesce(max(id),0) + 1, false) FROM users"),
      knex.raw("SELECT setval(pg_get_serial_sequence('jobs', 'id'), coalesce(max(id),0) + 1, false) FROM jobs")
    )).then(_ => Promise.join(
      // Inserts seed entries
      knex('users').insert({ name: 'Testy McTesterpants', email: 'user@example.com', password: hashedPassword, is_active: true, is_admin: true, dt_created: now }),
      knex('users').insert({ name: 'Chester Tester', email: 'chester@tester.com', password: hashedPassword, is_active: true, is_admin: false, dt_created: now }),
      knex('users').insert({ name: 'Boaty McBoatface', email: 'boaty@example.com', password: hashedPassword, is_active: true, is_admin: false, dt_created: now })
    ));
};
