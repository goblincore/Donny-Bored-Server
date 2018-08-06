'use strict';
const chai = require('chai');
const app = require('../server');
const chaiHttp = require('chai-http');
const {TEST_DATABASE_URL} = require('../config');
const expect = chai.expect;

chai.use(chaiHttp);

// Clear the console before each run
process.stdout.write('\x1Bc\n');

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

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
  
});

describe('Mocha and Chai', function() {
    it('should be properly setup', function() {
      expect(true).to.be.true;
    });
  });


  before(function() {
    return dbConnect(TEST_DATABASE_URL);
  });
  
  after(function() {
    return dbDisconnect();
  });