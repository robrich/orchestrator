/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
require('should');
require('mocha');

describe('orchestrator', function() {
	describe('hasTask()', function() {

		it('should return true if there is a task', function(done) {
			var orchestrator, name, task1, expected, actual;

			// arrange
			name = 'task1';
			task1 = {
				name: name,
				fn: function() {}
			};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.tasks[name] = task1;

			// act
			expected = true;
			actual = orchestrator.hasTask(name);

			// assert
			actual.should.equal(expected);
			done();
		});

		it('should return false if there is no such task', function(done) {
			var orchestrator, name, task1, expected, actual;

			// arrange
			name = 'task1';
			task1 = {
				name: name,
				fn: function() {}
			};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.tasks[name] = task1;

			// act
			expected = false;
			actual = orchestrator.hasTask('not'+name);

			// assert
			actual.should.equal(expected);
			done();
		});

	});
});
