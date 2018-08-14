'use strict';
const chai = require('chai');
const app = require('../server');
const chaiHttp = require('chai-http');
const {TEST_DATABASE_URL} = require('../config');
const expect = chai.expect;

chai.use(chaiHttp);