/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('_emitTaskDone()', function() {

		it('should emit task_stop if no err', function(done) {
			var orchestrator, taskName, task, message, err;

			// Arrange
			taskName = 'test';
			message = 'test message';
			task = {
				name: taskName,
				fn: function() {}
			};
			//err = undefined;

			// Thing under test
			orchestrator = new Orchestrator();

			orchestrator.on('task_stop', function (/*args*/) {
				// Assert
				done();
			});
			
			// Act
			orchestrator._emitTaskDone(task, message, err);
		});

		it('should emit task_err if err', function(done) {
			var orchestrator, taskName, task, message, err;

			// Arrange
			taskName = 'test';
			message = 'test message';
			task = {
				name: taskName,
				fn: function() {}
			};
			err = 'the error';

			// Thing under test
			orchestrator = new Orchestrator();

			orchestrator.on('task_err', function (/*args*/) {
				// Assert
				done();
			});
			
			// Act
			orchestrator._emitTaskDone(task, message, err);
		});

		it('should pass task, message, duration', function(done) {
			var orchestrator, taskName, task, message, duration, err;

			// Arrange
			taskName = 'test';
			message = 'test message';
			duration = 1.1;
			task = {
				name: taskName,
				fn: function() {},
				duration: duration
			};
			//err = undefined;

			// Thing under test
			orchestrator = new Orchestrator();

			orchestrator.on('task_stop', function (args) {
				// Assert
				args.task.should.equal(taskName);
				args.duration.should.equal(duration);
				args.message.should.equal(taskName+' '+message);
				done();
			});

			// Act
			orchestrator._emitTaskDone(task, message, err);
		});

		it('should pass err', function(done) {
			var orchestrator, taskName, task, message, err;

			// Arrange
			taskName = 'test';
			message = 'test message';
			task = {
				name: taskName,
				fn: function() {}
			};
			err = 'the error';

			// Thing under test
			orchestrator = new Orchestrator();

			orchestrator.on('task_err', function (args) {
				// Assert
				args.err.should.equal(err);
				done();
			});
			
			// Act
			orchestrator._emitTaskDone(task, message, err);
		});

		it('should die if no task passed', function(done) {
			// Arrange
			var orchestrator = new Orchestrator();
			var succeed = false;

			// Act
			try {
				orchestrator._emitTaskDone();
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
