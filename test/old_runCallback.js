/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
var Q = require('q');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('run() callback', function() {

		it('should have empty error on succeeding tasks', function(done) {
			var orchestrator, a;

			// arrange
			orchestrator = new Orchestrator();
			a = 0;
			orchestrator.task('test', function() {
				++a;
			});

			// act
			orchestrator.run('test', function(err) {
				// assert
				a.should.equal(1);
				should.not.exist(err);
				done();
			});
		});

		it('should have error on fail by callback tasks', function(done) {
			var orchestrator, a, expectedErr = {message:'the error'};

			// arrange
			orchestrator = new Orchestrator();
			a = 0;
			orchestrator.task('test', function (cb) {
				++a;
				cb(expectedErr);
			});
			orchestrator.on('error', function (/*e*/) {
				// avoid blowing up
			});

			// act
			orchestrator.run('test', function(err) {
				// assert
				a.should.equal(1);
				should.exist(err);
				should.deepEqual(err, expectedErr);
				done();
			});
		});

		it('should have error on sync throw', function(done) {
			var orchestrator, a, errMess = 'the error message';

			// arrange
			orchestrator = new Orchestrator();
			a = 0;
			orchestrator.task('test', function () {
				++a;
				throw new Error(errMess);
			});
			orchestrator.on('error', function (/*e*/) {
				// avoid blowing up
			});

			// act
			orchestrator.run('test', function(err) {
				// assert
				a.should.equal(1);
				should.exist(err);
				err.message.should.equal(errMess);
				done();
			});
		});

		it('should have error on promise rejected', function(done) {
			var orchestrator, a, expectedErr = 'the error message';

			// arrange
			orchestrator = new Orchestrator();
			a = 0;
			orchestrator.task('test', function () {
				var deferred = Q.defer();
				setTimeout(function () {
					++a;
					deferred.reject(expectedErr);
				},1);
				return deferred.promise;
			});
			orchestrator.on('error', function (/*e*/) {
				// avoid blowing up
			});

			// act
			orchestrator.run('test', function(actualErr) {
				// assert
				a.should.equal(1);
				should.exist(actualErr);
				actualErr.should.equal(expectedErr);
				done();
			});
		});

		it('should have error on missing task', function(done) {
			var orchestrator, name, a, expectedErr;

			// arrange
			name = 'test';
			a = 0;
			orchestrator = new Orchestrator();
			// no 'test' task defined

			// act
			orchestrator.on('error', function (e) {
				a++;
				should.exist(e.err);
				e.err.missingTask.should.equal(name);
				e.err.message.should.match(/not defined/i, e.message+' should include not defined');
				expectedErr = e.err;
			});
			orchestrator.run(name, function(actualErr) {
				// assert
				a.should.equal(1);
				should.exist(actualErr);
				actualErr.should.equal(expectedErr);
				done();
			});
		});

		it('should have error on recursive tasks', function(done) {
			var orchestrator, name, a, expectedErr;

			// arrange
			name = 'test';
			a = 0;
			orchestrator = new Orchestrator();
			orchestrator.task(name, [name]);

			// act
			orchestrator.on('error', function (e) {
				a++;
				e.err.recursiveTasks.length.should.equal(2);
				e.err.recursiveTasks[0].should.equal(name);
				e.err.recursiveTasks[1].should.equal(name);
				e.err.message.should.match(/recursive/i, e.message+' should include recursive');
				expectedErr = e.err;
			});
			orchestrator.run(name, function(actualErr) {
				// assert
				a.should.equal(1);
				should.exist(actualErr);
				actualErr.should.equal(expectedErr);
				done();
			});
		});

		it('should supress error when calling callback too many times with success', function(done) {
			var orchestrator, a, timeout = 30;

			// arrange
			orchestrator = new Orchestrator();
			a = 0;
			orchestrator.task('test', function (cb) {
				cb(null);
				cb(null);
			});

			// act
			orchestrator.run('test', function(err) {
				// assert
				should.not.exist(err);
				a++;
			});
			setTimeout(function () {
				a.should.equal(1);
				done();
			}, timeout);
		});

		it('should have error when calling callback too many times with fail', function(done) {
			var orchestrator, a, timeout = 30;

			// arrange
			orchestrator = new Orchestrator();
			a = 0;
			var expectedErr = 'not null';
			orchestrator.task('test', function (cb) {
				cb(null);
				cb(expectedErr);
			});
			orchestrator.on('error', function (/*e*/) {
				// avoid blowing up
			});

			// act
			orchestrator.run('test', function(err) {
				// assert
				should.exist(err);
				err.should.equal(expectedErr);
				a++;
			});
			setTimeout(function () {
				a.should.equal(1);
				done();
			}, timeout);
		});

	});
});
