'use strict';

var chai = require('chai');
var expect = chai.expect;

var Orchestrator = require('../');

describe('orchestrator', function() {
	describe('task()', function() {

		it('should return task if there is a task', function() {
			var orchestrator, name, task1, actual;

			// Arrange
			name = 'task1';
			task1 = function(){};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.registry.tasks[name] = task1;

			// Act
			actual = orchestrator.task(name);

			// Assert
			expect(actual).to.equal(task1);
		});

		it('should return false if there is no such task', function() {
			var orchestrator, actual;

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			actual = orchestrator.task('notexist');

			// Assert
			expect(actual).not.exist;
		});

		it('should create a task if passed a second arg', function() {
			var orchestrator, name, fn, actual;

			// Arrange
			name = 'task1';
			fn = function () {};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			orchestrator.task(name, fn);

			// Assert
			expect(orchestrator.registry.tasks[name]).to.exist;
			expect(orchestrator.registry.tasks[name]).to.equal(fn);
		});

	});
});
