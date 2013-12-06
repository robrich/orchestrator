/*jshint node:true */
/*global describe:false, it:false */
"use strict";

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('_resetSpecificTasks()', function() {

		it('should set done = false on specified done tasks', function(done) {
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
				test1: task1,
				test2: task2
			};

			// Act
			orchestrator._resetSpecificTasks(['test1','test2']);

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
				test1: task1,
				test2: task2
			};

			// Act
			orchestrator._resetSpecificTasks(['test1','test2']);

			// Assert
			should.not.exist(task1.done);
			should.not.exist(task2.done);
			done();
		});

		it('should set done = false on done dependency', function(done) {
			var orchestrator, task, dep;

			// Arrange
			task = {
				name: 'test',
				dep: ['dep'],
				fn: function() {}
				// no done though irrelevant to current test
			};
			dep = {
				name: 'dep',
				fn: function() {},
				done: true
			};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.tasks = {
				test: task,
				dep: dep
			};

			// Act
			orchestrator._resetSpecificTasks(['test']);

			// Assert
			dep.done.should.equal(false);
			done();
		});

		it('should not set done on irrelevant tasks', function(done) {
			var orchestrator, task, irrelevant;

			// Arrange
			task = {
				name: 'test',
				fn: function() {}
				// no done though irrelevant to current test
			};
			irrelevant = {
				name: 'irrelevant',
				fn: function() {},
				done: true
			};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.tasks = {
				test: task,
				irrelevant: irrelevant
			};

			// Act
			orchestrator._resetSpecificTasks(['test']);

			// Assert
			irrelevant.done.should.equal(true);
			done();
		});

		it('should not die if dependency does not exist', function(done) {
			var orchestrator, task;

			// Arrange
			task = {
				name: 'test',
				dep: ['dep'], // dep doesn't exist
				fn: function() {}
				// no done though irrelevant to current test
			};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.tasks = {
				test: task
			};

			// Act
			orchestrator._resetSpecificTasks(['test']);

			// Assert
			// we're still here so it worked
			done();
		});

	});
});
