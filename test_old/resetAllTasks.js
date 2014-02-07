/*jshint node:true */
/*global describe:false, it:false */
"use strict";

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('_resetAllTasks()', function() {

		it('should set done = false on all done tasks', function(done) {
			var orchestrator, task1, task2;

			// Arrange
			task1 = {
				name: 'test1',
				fn: function() {},
				done: true
			};
			task2 = {
				name: 'test2',
				fn: function() {},
				done: true
			};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.tasks = {
				task1: task1,
				task2: task2
			};

			// Act
			orchestrator._resetAllTasks();

			// Assert
			task1.done.should.equal(false);
			task2.done.should.equal(false);
			done();
		});

		it('should not set done = false if done does not exist', function(done) {
			var orchestrator, task1, task2;

			// Arrange
			task1 = {
				name: 'test1',
				fn: function() {}
				// no done
			};
			task2 = {
				name: 'test2',
				fn: function() {}
				// no done
			};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.tasks = {
				task1: task1,
				task2: task2
			};

			// Act
			orchestrator._resetAllTasks();

			// Assert
			should.not.exist(task1.done);
			should.not.exist(task2.done);
			done();
		});

	});
});
