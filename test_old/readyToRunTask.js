/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('_readyToRunTask() task is ready when dependencies are resolved', function() {

		it('should be ready if no dependencies', function(done) {
			var orchestrator, task, expected, actual;

			// Arrange
			expected = true;
			task = {
				name: 'a',
				dep: []
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator.tasks = { a: task };
			actual = orchestrator._readyToRunTask(task);

			// Assert
			actual.should.equal(expected);
			done();
		});

		it('should be ready if dependency is done', function(done) {
			var orchestrator, task, dep, expected, actual;

			// Arrange
			expected = true;
			task = {
				name: 'a',
				dep: ['b']
			};
			dep = {
				name: 'b',
				dep: [],
				done: true
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator.tasks = { a: task, b: dep };
			actual = orchestrator._readyToRunTask(task);

			// Assert
			actual.should.equal(expected);
			done();
		});

		it('should not be ready if dependency is not done', function(done) {
			var orchestrator, task, dep, expected, actual;

			// Arrange
			expected = false;
			task = {
				name: 'a',
				dep: ['b']
			};
			dep = {
				name: 'b',
				dep: []
				//done: lack of var is falsey
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator.tasks = { a: task, b: dep };
			actual = orchestrator._readyToRunTask(task);

			// Assert
			actual.should.equal(expected);
			done();
		});

		it('should stop() if dependency is missing', function(done) {
			var orchestrator, task, cb, expected, actual, expectedErr;

			// Arrange
			expected = false;
			task = {
				name: 'a',
				dep: ['b'] // which doesn't exist
			};
			cb = function (err) {
				expectedErr = err;
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator.tasks = { a: task };
			orchestrator.doneCallback = cb;
			actual = orchestrator._readyToRunTask(task);

			// Assert
			should.exist(expectedErr);
			expectedErr.indexOf('exist').should.be.above(-1);
			actual.should.equal(expected);
			done();
		});

	});
});
