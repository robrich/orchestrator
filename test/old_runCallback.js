/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
var Q = require('q');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('runParallel() callback', function() {

		it('should have empty error on succeeding tasks', function(done) {
			var orchestrator, a;

			// arrange
			orchestrator = new Orchestrator();
			a = 0;
			orchestrator.task('test', function() {
				++a;
			});

			// act
			orchestrator.runParallel('test', function(err) {
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
			orchestrator.runParallel('test', function(err) {
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
			orchestrator.runParallel('test', function(err) {
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
			orchestrator.runParallel('test', function(actualErr) {
				// assert
				a.should.equal(1);
				should.exist(actualErr);
				actualErr.should.equal(expectedErr);
				done();
			});
		});

		it('should have error on missing task', function(done) {
			var orchestrator, name, a;

			// arrange
			name = 'test';
			a = 0;
			orchestrator = new Orchestrator();
			// no 'test' task defined

			// act
			orchestrator.runParallel(name, function(err) {
				// assert
				should.exist(err);
				err.missingTasks.length.should.equal(1);
				err.missingTasks[0].should.equal(name);
				err.message.should.match(/not defined/i, err.message+' should include not defined');
				done();
			});
		});

		it('should have error on recursive tasks', function(done) {
			var orchestrator, name, a;

			// arrange
			name = 'test';
			a = 0;
			orchestrator = new Orchestrator();
			orchestrator.task(name, [name]);

			// act
			orchestrator.runParallel(name, function(err) {
				// assert
				err.recursiveTasks.length.should.equal(2);
				err.recursiveTasks[0].should.equal(name);
				err.recursiveTasks[1].should.equal(name);
				err.message.should.match(/recursive/i, err.message+' should include recursive');
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
			orchestrator.runParallel('test', function(err) {
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
			orchestrator.runParallel('test', function(err) {
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
