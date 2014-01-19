/*jshint node:true */
/*global describe:false, it:false */
"use strict";

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('stop()', function() {

		it('should call doneCallback', function(done) {
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
			orchestrator.stop(null, true); // true means success

			// Assert
			orchestrator.isRunning.should.equal(false);
			done();
		});

		it('should log success', function (done) {
			var orchestrator, actualLog;

			// Arrange
			orchestrator = new Orchestrator();
			orchestrator.on('stop', function (e) {
				actualLog = e;
			});

			// Act
			orchestrator.stop(null, true); // true means success

			// Assert
			should.exist(actualLog);
			should.not.exist(actualLog.task);
			actualLog.message.indexOf('succeed').should.be.above(-1);
			done();
		});

		it('should log failure', function (done) {
			var orchestrator, actualLog;

			// Arrange
			orchestrator = new Orchestrator();
			orchestrator.on('err', function (e) {
				actualLog = e;
			});

			// Act
			orchestrator.stop(null, false); // false means aborted

			// Assert
			should.exist(actualLog);
			should.not.exist(actualLog.task);
			actualLog.message.indexOf('abort').should.be.above(-1);
			done();
		});

		it('should log exception', function (done) {
			var orchestrator, actualErr = 'the error', actualLog;

			// Arrange
			orchestrator = new Orchestrator();
			orchestrator.on('err', function (e) {
				actualLog = e;
			});

			// Act
			orchestrator.stop(actualErr); // false means aborted

			// Assert
			should.exist(actualLog);
			should.not.exist(actualLog.task);
			actualLog.message.indexOf('fail').should.be.above(-1);
			actualLog.err.should.equal(actualErr);
			done();
		});

		it('should throw if no callback and no err handler', function (done) {
			var orchestrator, expectedErr = 'the error', actualErr;

			// Arrange
			orchestrator = new Orchestrator();

			// Act
			try {
				orchestrator.stop(expectedErr);

				// Assert
			} catch (err) {
				actualErr = err;
			}

			actualErr.should.equal(expectedErr);
			done();
		});

	});
});
