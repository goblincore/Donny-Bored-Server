'use strict';
const chai = require('chai');
const app = require('../server');
const chaiHttp = require('chai-http');
const {TEST_DATABASE_URL, JWT_SECRET} = require('../config');
const expect = chai.expect;

chai.use(chaiHttp);
const createKnex = require('knex');

const {DATABASE_URL} = require('../config');

let knex = null;

function dbConnect(url = DATABASE_URL) {
  knex = createKnex({
    client: 'pg',
    connection: url
  });
}

function dbDisconnect() {
  return knex.destroy();
}

function dbGet() {
  return knex;
}

module.exports = {
  dbConnect,
  dbDisconnect,
  dbGet
};

