/*jshint node:true */
/*global describe:false, it:false */
"use strict";

var Orchestrator = require('../');
require('should');
require('mocha');

describe('orchestrator', function() {
	describe('_stopTask()', function() {

		it('should set done = true', function(done) {
			var orchestrator, task, meta;

			// Arrange
			task = {
				name: 'test',
				fn: function() {}
			};
			meta = {
				duration: 2,
				hrDuration: [2,2]
			};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			orchestrator._stopTask(task, meta);

			// Assert
			task.done.should.equal(true);
			done();
		});

		it('should set running = false', function(done) {
			var orchestrator, task, meta;

			// Arrange
			task = {
				name: 'test',
				fn: function() {},
				running: true
			};
			meta = {
				duration: 2,
				hrDuration: [2,2]
			};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			orchestrator._stopTask(task, meta);

			// Assert
			task.running.should.equal(false);
			done();
		});

		it('should set task.duration', function(done) {
			var orchestrator, duration, task, meta;

			// Arrange
			duration = 2;
			task = {
				name: 'test',
				fn: function() {},
				start: new Date()
			};
			meta = {
				duration: duration,
				hrDuration: [2,2]
			};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			orchestrator._stopTask(task, meta);

			// Assert
			(typeof task.duration).should.equal('number');
			task.duration.should.equal(duration);
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
