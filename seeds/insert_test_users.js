var bcrypt = require('bcryptjs');

exports.seed = function(knex, Promise) {
  var hashedPassword = bcrypt.hashSync('password', 10);

  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(),

    // Inserts seed entries
    knex('users').insert({ name: 'Testy McTesterpants', email: 'testy@example.com', password: hashedPassword, dt_created: new Date() }),
    knex('users').insert({ name: 'Chester Tester', email: 'chester@tester.com', password: hashedPassword, dt_created: new Date() }),
    knex('users').insert({ name: 'John Doe', email: 'john.doe@example.com', password: hashedPassword, dt_created: new Date() })
  );
};
