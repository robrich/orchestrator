/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
require('should');
require('mocha');

describe('orchestrator', function() {
	describe('hasTask()', function() {

		it('should return true if there is a task', function(done) {
			var orchestrator, name, task1, actual;

			// Arrange
			name = 'task1';
			task1 = {
				name: name,
				fn: function() {}
			};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.tasks[name] = task1;

			// Act
			actual = orchestrator.hasTask(name);

			// Assert
			actual.should.equal(true);
			done();
		});

		it('should return false if there is no such task', function(done) {
			var orchestrator, name, task1, actual;

			// Arrange
			name = 'task1';
			task1 = {
				name: name,
				fn: function() {}
			};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.tasks[name] = task1;

			// Act
			actual = orchestrator.hasTask('not'+name);

			// Assert
			actual.should.equal(false);
			done();
		});

	});
});
