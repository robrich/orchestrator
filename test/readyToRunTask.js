/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var Orchestrator = require('../');
require('should');
require('mocha');

describe('orchestrator task is ready when dependencies are resolved', function() {
	describe('_readyToRunTask()', function() {

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

	});
});
