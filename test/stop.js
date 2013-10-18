/*jshint node:true */
/*global describe:false, it:false */
"use strict";

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('orchestrator stop', function() {
	describe('stop()', function() {

		it('should call and clear doneCallback', function(done) {
			var orchestrator, a = 0;

			// Arrange
			orchestrator = new Orchestrator();
			orchestrator.doneCallback = function (/*err*/) {
				a++;
			};

			// Act
			orchestrator.stop(null);

			// Assert
			a.should.equal(1);
			should.not.exist(orchestrator.doneCallback);
			done();
		});

		it('should not recurse when doneCallback calls stop', function(done) {
			var orchestrator, a = 0;

			// Arrange
			orchestrator = new Orchestrator();
			orchestrator.doneCallback = function (err) {
				a++;
				orchestrator.stop(err);
			};

			// Act
			orchestrator.stop(null);

			// Assert
			a.should.equal(1);
			done();
		});

		it('should pass error to doneCallback', function(done) {
			var orchestrator, actualError, expectedError = 'This is a test error';

			// Arrange
			orchestrator = new Orchestrator();
			orchestrator.doneCallback = function (err) {
				actualError = err;
			};

			// Act
			orchestrator.stop(expectedError);

			// Assert
			should.exist(actualError);
			actualError.should.equal(expectedError);
			done();
		});

		it('should set isRunning to false', function(done) {
			var orchestrator;

			// Arrange
			orchestrator = new Orchestrator();
			orchestrator.isRunning = true;

			// Act
			orchestrator.stop(null);

			// Assert
			orchestrator.isRunning.should.equal(false);
			done();
		});

		// it('should log the correct reason', function (done) {
		// TODO: mock console.log()

	});
});
