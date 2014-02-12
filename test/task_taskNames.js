/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
require('should');
require('mocha');

describe('orchestrator', function() {
	describe('taskNames()', function() {
		var noop = function () {};

		var addTask = function (orchestrator, name) {
			orchestrator.tasks[name] = {
				name: name,
				fn: noop
			};
		};

		it('should return two task names', function(done) {
			var orchestrator, name1, name2, actual;

			// Arrange
			name1 = 'task1';
			name2 = 'task2';

			// the thing under test
			orchestrator = new Orchestrator();
			addTask(orchestrator, name1);
			addTask(orchestrator, name2);

			// Act
			actual = orchestrator.taskNames();

			// Assert
			actual.length.should.equal(2);
			actual[0].should.equal(name1);
			actual[1].should.equal(name2);
			done();
		});

		it('should return no tasks when the task queue is empty', function(done) {
			var orchestrator, actual;

			// Arrange

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			actual = orchestrator.taskNames();

			// Assert
			actual.length.should.equal(0);
			done();
		});

	});
});
