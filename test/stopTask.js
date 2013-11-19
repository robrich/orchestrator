/*jshint node:true */
/*global describe:false, it:false */
"use strict";

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('orchestrator stop task', function() {
	describe('_stopTask()', function() {

		it('should set done = true', function(done) {
			var orchestrator, task;

			// Arrange
			task = {
				name: 'test',
				fn: function() {}
			};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			orchestrator._stopTask(task);

			// Assert
			task.done.should.equal(true);
			done();
		});

		it('should set running = false', function(done) {
			var orchestrator, task;

			// Arrange
			task = {
				name: 'test',
				fn: function() {},
				running: true
			};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			orchestrator._stopTask(task);

			// Assert
			task.running.should.equal(false);
			done();
		});

		it('should set stop date', function(done) {
			var orchestrator, task;

			// Arrange
			task = {
				name: 'test',
				fn: function() {}
			};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			orchestrator._stopTask(task);

			// Assert
			should.exist(task.stop);
			(task.stop instanceof Date).should.equal(true);
			done();
		});

		it('should set task.duration if task.start', function(done) {
			var orchestrator, task;

			// Arrange
			task = {
				name: 'test',
				fn: function() {},
				start: new Date()
			};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			orchestrator._stopTask(task);

			// Assert
			(typeof task.duration).should.equal('number');
			task.duration.should.be.below(1.0); // ASSUME: it took less than 1 seconds to run this test
			if (task.duration < 0.0) {
				task.duration.should.be.above(0.0); // FRAGILE: >= 0
			}
			done();
		});

		it('should not set task.duration if no task.start', function(done) {
			var orchestrator, task;

			// Arrange
			task = {
				name: 'test',
				fn: function() {},
				// no start
			};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			orchestrator._stopTask(task);

			// Assert
			should.not.exist(task.duration);
			done();
		});

		it('should die if not passed a task', function(done) {
			// Arrange
			var orchestrator = new Orchestrator();
			var succeed = false;

			// Act
			try {
				orchestrator._stopTask();
				succeed = true;
			} catch (err) {
				succeed = false;
			}

			// Assert
			succeed.should.equal(false);
			done();
		});

	});
});
