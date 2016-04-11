var request = require('supertest');
var expect = require('chai').expect;

process.env.NODE_ENV = 'production';
var app = require('../app');

describe('Test fonts files', function () {
    it('responds to /fonts/fontello.svg', function (done) {
      request(app)
        .get('/fonts/fontello.svg')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
    it('responds to /fonts/fontello.eot', function (done) {
      request(app)
        .get('/fonts/fontello.eot')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
    it('responds to /fonts/fontello.ttf', function (done) {
      request(app)
        .get('/fonts/fontello.ttf')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
    it('responds to /fonts/fontello.woff', function (done) {
      request(app)
        .get('/fonts/fontello.woff')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
    it('responds to /fonts/fontello.woff2', function (done) {
      request(app)
        .get('/fonts/fontello.woff2')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
});

describe('Test views files', function () {
    it('responds to /views/login.html', function (done) {
      request(app)
        .get('/views/login.html')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
    it('responds to /views/signup.html', function (done) {
      request(app)
        .get('/views/signup.html')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
    it('responds to /views/users-id.html', function (done) {
      request(app)
        .get('/views/users-id.html')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
    it('responds to /views/users-list.html', function (done) {
      request(app)
        .get('/views/users-list.html')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
    it('responds to /views/users-new.html', function (done) {
      request(app)
        .get('/views/users-new.html')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
});

describe('Test styles file', function () {
    it('responds to /stylesheets/styles.css', function (done) {
      request(app)
        .get('/stylesheets/styles.css')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
});

describe('Test errors', function () {
    it('404 everything else', function (done) {
        request(app)
          .get('/foo/bar')
          .expect(404, done);
    });
});

describe('Test favicon.ico', function () {
    it('responds to /favicon.ico', function (done) {
      request(app)
        .get('/favicon.ico')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
});
