/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('_runTask() tasks execute as expected', function() {

		it('calls task function', function(done) {
			var orchestrator, a, task;

			// Arrange
			a = 0;
			task = {
				name: 'test',
				fn: function() {
					++a;
				}
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator._runTask(task);

			// Assert
			a.should.equal(1);
			done();
		});

		it('sets .running correctly', function(done) {
			var orchestrator, task;

			// Arrange
			task = {
				name: 'test',
				fn: function() {
					should.exist(task.running);
					task.running.should.equal(true);
				}
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator._runTask(task);

			// Assert
			should.exist(task.running);
			task.running.should.equal(false);
			done();
		});

		it('logs start', function(done) {
			var orchestrator, task, a = 0;

			// Arrange
			task = {
				name: 'test',
				fn: function() {
				}
			};

			// Act
			orchestrator = new Orchestrator();
			orchestrator.on('task_start', function (e) {
				should.exist(e.task);
				e.task.should.equal('test');
				++a;
			});
			orchestrator._runTask(task);

			// Assert
			a.should.equal(1);
			done();
		});

		it('passes start args to stop event', function(done) {
			var orchestrator, task, passthrough, a = 0;

			// Arrange
			task = {
				name: 'test',
				fn: function() {
				}
			};
			passthrough = 'passthrough';

			// Act
			orchestrator = new Orchestrator();
			orchestrator.on('task_start', function (e) {
				e.passthrough = passthrough;
				++a;
			});
			orchestrator.on('task_stop', function (e) {
				e.passthrough.should.equal(passthrough);
				++a;
			});
			orchestrator._runTask(task);

			// Assert
			a.should.equal(2);
			done();
		});

	});
});
