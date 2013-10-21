/*jshint node:true */
/*global describe:false, it:false */
"use strict";

var Orchestrator = require('../');
var Q = require('q');
var should = require('should');
require('mocha');

describe('orchestrator done callback', function() {
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

	});
});
