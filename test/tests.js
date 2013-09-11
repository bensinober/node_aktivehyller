var assert = require('assert');
var expect = require('expect.js');
var express = require('express');
var request = require('supertest');
var app = require('../app.js');
 
describe('GET /', function(){
  it('respond with plain text', function(done){
    request('localhost:4567')
      .get('/')
      .expect(200, done);
  });

  it('fails on wrong page', function(done){
    request('localhost:4567')
      .get('/bogus')
      .expect(404, done);
  });
})

