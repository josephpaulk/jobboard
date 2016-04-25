'use strict';

const bcrypt = require('bcryptjs');

exports.seed = function(knex, Promise) {
  let now = new Date();
  let hashedPassword = bcrypt.hashSync('password', 10);

  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(),

    // Inserts seed entries
    knex('users').insert({ name: 'Testy McTesterpants', email: 'user@example.com', password: hashedPassword, is_active: true, is_admin: true, dt_created: now }),
    knex('users').insert({ name: 'Chester Tester', email: 'chester@tester.com', password: hashedPassword, is_active: true, is_admin: false, dt_created: now }),
    knex('users').insert({ name: 'Boaty McBoatface', email: 'boaty@example.com', password: hashedPassword, is_active: true, is_admin: false, dt_created: now })
  );
};
