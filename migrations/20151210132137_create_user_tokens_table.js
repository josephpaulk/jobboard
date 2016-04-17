
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_auth_tokens', function(t) {
    t.increments('id').primary();
    t.integer('user_id').index();
    t.string('access_token').notNull();
    t.dateTime('dt_created').notNull();
    t.dateTime('dt_expires').notNull();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user_auth_tokens');
};
