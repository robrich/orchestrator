/*jshint node:true */
/*global describe:false, it:false */
"use strict";

var Orchestrator = require('../');
var Q = require('q');
var fs = require('fs');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('stop() callback', function() {

		it('should have empty error on succeeding tasks', function(done) {
			var orchestrator, a;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			orchestrator.add('test', function() {
				++a;
			});

			// Act
			orchestrator.start('test', function(err) {
				// Assert
				a.should.equal(1);
				should.not.exist(err);
				orchestrator.isRunning.should.equal(false);
				done();
			});
		});

		it('should have error on fail by callback tasks', function(done) {
			var orchestrator, a, expectedErr = {message:'the error'};

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			orchestrator.add('test', function (cb) {
				++a;
				cb(expectedErr);
			});

			// Act
			orchestrator.start('test', function(err) {
				// Assert
				a.should.equal(1);
				should.exist(err);
				should.deepEqual(err, expectedErr);
				orchestrator.isRunning.should.equal(false);
				done();
			});
		});

		it('should have error on sync throw', function(done) {
			var orchestrator, a, errMess = 'the error message';

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			orchestrator.add('test', function () {
				++a;
				throw new Error(errMess);
			});

			// Act
			orchestrator.start('test', function(err) {
				// Assert
				a.should.equal(1);
				should.exist(err);
				err.message.should.equal(errMess);
				orchestrator.isRunning.should.equal(false);
				done();
			});
		});

		it('should have error on promise rejected', function(done) {
			var orchestrator, a, expectedErr = 'the error message';

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			orchestrator.add('test', function () {
				var deferred = Q.defer();
				setTimeout(function () {
					++a;
					deferred.reject(expectedErr);
				},1);
				return deferred.promise;
			});

			// Act
			orchestrator.start('test', function(actualErr) {
				// Assert
				a.should.equal(1);
				should.exist(actualErr);
				actualErr.should.equal(expectedErr);
				orchestrator.isRunning.should.equal(false);
				done();
			});
		});

		it('should have error on stream error', function(done) {
			var orchestrator;

			// Arrange
			orchestrator = new Orchestrator();
			orchestrator.add('test', function () {
				return fs.createReadStream('./index.js')
					.pipe(fs.createWriteStream('./something/that/does/not/exist'));
			});

			// Act
			orchestrator.start('test', function(actualErr) {
				// Assert
				should.exist(actualErr);
				orchestrator.isRunning.should.equal(false);
				done();
			});
		});

		it('should have error on missing task', function(done) {
			var orchestrator, name, a, expectedErr;

			// Arrange
			name = 'test';
			a = 0;
			orchestrator = new Orchestrator();
			// no 'test' task defined

			// Act
			orchestrator.on('task_not_found', function (e) {
				a++;
				e.task.should.equal(name);
				e.message.should.match(/not defined/i, e.message+' should include not defined');
				should.exist(e.err);
				expectedErr = e.err;
			});
			orchestrator.start(name, function(actualErr) {
				// Assert
				a.should.equal(1);
				should.exist(actualErr);
				actualErr.should.equal(expectedErr);
				orchestrator.isRunning.should.equal(false);
				done();
			});
		});

		it('should have error on recursive tasks', function(done) {
			var orchestrator, name, a, expectedErr;

			// Arrange
			name = 'test';
			a = 0;
			orchestrator = new Orchestrator();
			orchestrator.add(name, [name]);

			// Act
			orchestrator.on('task_recursion', function (e) {
				a++;
				e.recursiveTasks.length.should.equal(2);
				e.recursiveTasks[0].should.equal(name);
				e.recursiveTasks[1].should.equal(name);
				e.message.should.match(/recursive/i, e.message+' should include recursive');
				should.exist(e.err);
				expectedErr = e.err;
			});
			orchestrator.start(name, function(actualErr) {
				// Assert
				a.should.equal(1);
				should.exist(actualErr);
				actualErr.should.equal(expectedErr);
				orchestrator.isRunning.should.equal(false);
				done();
			});
		});

		it('should have error when calling callback too many times', function(done) {
			var orchestrator, a, timeout = 30;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			orchestrator.add('test', function (cb) {
				cb(null);
				cb(null);
			});

			// Act
			orchestrator.start('test', function(err) {
				// Assert
				switch (a) {
					case 0:
						// first finish
						should.not.exist(err);
						break;
					case 1:
						// second finish
						should.exist(err);
						err.message.indexOf('too many times').should.be.above(-1);
						break;
					default:
						done('finished too many times');
				}
				a++;
			});
			setTimeout(function () {
				a.should.equal(2);
				done();
			}, timeout);
		});

	});
});
