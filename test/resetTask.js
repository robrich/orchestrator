/*jshint node:true */
/*global describe:false, it:false */
"use strict";

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('_resetTask()', function() {

		it('should set done = false on done task', function(done) {
			var orchestrator, task;

			// Arrange
			task = {
				name: 'test',
				fn: function() {},
				done: true
			};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			orchestrator._resetTask(task);

			// Assert
			task.done.should.equal(false);
			done();
		});

		it('should not set done = false if done does not exist', function(done) {
			var orchestrator, task;

			// Arrange
			task = {
				name: 'test',
				fn: function() {}
				// no done
			};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			orchestrator._resetTask(task);

			// Assert
			should.not.exist(task.done);
			done();
		});

		it('should remove start', function(done) {
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
			orchestrator._resetTask(task);

			// Assert
			should.not.exist(task.start);
			done();
		});

		it('should remove stop', function(done) {
			var orchestrator, task;

			// Arrange
			task = {
				name: 'test',
				fn: function() {},
				stop: new Date()
			};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			orchestrator._resetTask(task);

			// Assert
			should.not.exist(task.stop);
			done();
		});

		it('should remove duration', function(done) {
			var orchestrator, task;

			// Arrange
			task = {
				name: 'test',
				fn: function() {},
				duration: new Date()
			};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			orchestrator._resetTask(task);

			// Assert
			should.not.exist(task.duration);
			done();
		});

		it('should remove args', function(done) {
			var orchestrator, task;

			// Arrange
			task = {
				name: 'test',
				fn: function() {},
				args: {}
			};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			orchestrator._resetTask(task);

			// Assert
			should.not.exist(task.args);
			done();
		});

		it('should not die if not passed a task', function(done) {
			// Arrange
			var orchestrator = new Orchestrator();

			// Act
			orchestrator._resetTask();

			// Assert
			// we're still here so it worked
			done();
		});

	});
});
