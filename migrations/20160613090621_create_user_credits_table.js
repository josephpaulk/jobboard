
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_job_credits', function(t) {
    t.increments('id').primary();
    t.integer('user_id').index().references('id').inTable('users').onDelete('CASCADE');
    t.integer('job_id').index().references('id').inTable('jobs').onDelete('CASCADE');
    t.integer('amount').notNull();
    t.string('note').notNull();
    t.dateTime('dt_created').notNull();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user_job_credits');
};
