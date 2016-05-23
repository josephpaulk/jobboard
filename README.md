# Techlahoma Job Board

Node.js job board used to power Techlahoma Jobs

## Email List

We have an email list just for folks who are waiting for the job board to go live.

[Sign up for the email list here.](http://techlahoma.us9.list-manage.com/subscribe?u=523ad83c59be7a4ae257beed1&id=6ecab16e86)

## Installation

Use Git to clone this app, then:

```
npm install
```

### ENV Variables Setup

Then create an `.env` file in the root directory file with the following
contents (the app will not start without this file, and will throw an error if
 any ENV variables are missing):

```
export NODE_PATH="./src"
export NODE_ENV="development"
export DATABASE_URL="postgres://user@localhost/joblahoma"
export COOKIE_SECRET="blah blah blah - something random here"
export JOBS_DAYS_TO_EXPIRE=30
export USER_TOKEN_DAYS_TO_EXPIRE=30
```

### Database Setup

Ensure `knex.js` is installed globally:

```
npm install -g knex
```

Run the database migrations:

```
knex migrate:latest
```

Run the database seeds if you want to see some fake data or run the tests:

```
knex seed:run
```

## Commands

Start the server with a single command:

```
npm run start
```

Transpile all the ES6/ES2015 client-side JavaScript for browsers

```
npm run build
```

Minify the JavaScript bundle for production use

```
npm run minify
```

