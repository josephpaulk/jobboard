
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(t) {
    t.increments('id').primary();
    t.string('name').notNull();
    t.string('email').notNull().unique();
    t.string('password').notNull();
    t.boolean('is_admin').notNull();
    t.dateTime('dt_created').notNull();
    t.dateTime('dt_updated').nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
