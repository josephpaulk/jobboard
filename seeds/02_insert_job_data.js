'use strict';

const faker = require('faker');
const config = require('shared/config');

exports.seed = function(knex, Promise) {
  function generateJobData(data) {
    let dt_created = new Date();
    let dt_expires = new Date();
    dt_expires.setDate(dt_expires.getDate() + 30);
    let fakeData = {
      title: faker.lorem.words(),
      location: faker.fake("{{address.city}}, {{address.stateAbbr}}"),
      description: faker.lorem.paragraphs(faker.random.number({ min: 3, max: 8 })),
      category: faker.random.arrayElement(Object.keys(config.jobs.categories)),
      telecommute: faker.random.arrayElement(Object.keys(config.jobs.telecommute)),
      apply_url: faker.internet.url(),
      company_name: faker.company.companyName(),
      company_url: faker.internet.url(),
      company_logo_url: null,
      company_email: faker.internet.exampleEmail(),
      is_live: true,
      is_featured: false,
      dt_created,
      dt_expires
    };

    return Object.assign(fakeData, data);
  }

  return Promise.join(
    // Deletes ALL existing entries
    knex('jobs').del(),

    // Inserts seed entries
    knex('jobs').insert(generateJobData({ user_id: 1, title: 'Senior Director of Awesomesauce' })),
    knex('jobs').insert(generateJobData({ user_id: 1, title: 'Super Ninja Rockstar Extraordinaire', is_featured: true })),
    knex('jobs').insert(generateJobData({ user_id: 1, title: 'Junior Data Analyst' })),
    knex('jobs').insert(generateJobData({ user_id: 2, title: 'Senior UX Designer' })),
    knex('jobs').insert(generateJobData({ user_id: 2, title: 'UI & Graphic Designer' })),
    knex('jobs').insert(generateJobData({ user_id: 2, title: 'UI & Graphic Designer Too', is_live: false })),
    knex('jobs').insert(generateJobData({ user_id: 3, title: '.NET Software Engineer – Junior to Mid-Level' })),
    knex('jobs').insert(generateJobData({ user_id: 3, title: 'Receptionist Extraordinaire', is_live: false }))
  );
};
