/*global describe:false, it:false */

'use strict';

var makeRunOneFn = require('../lib/run/makeRunOneFn');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('makeRunOneFn()', function() {

		var makeArgs = function (tasks, runOneFn, orchestrator, runOptions) {
			return {
				runTasks: tasks,
				runOneFn: runOneFn,
				orchestrator: orchestrator,
				runOptions: runOptions
			};
		};

		it('runs task successfully', function(done) {

			// arrange
			var tasks = {};
			var runOneFn = function () {};
			var orchestrator = {};
			var args = makeArgs(tasks, runOneFn, orchestrator);

			// act
			makeRunOneFn(args, function (err) {

				// assert
				should.not.exist(err);

				done();
			});
		});

		it('builds runOneFn for two tasks', function (done) {

			// arrange
			var tasks = {
				task1: {
					name: 'task1',
					dep: [],
					fn: function () {}
				},
				task2: {
					name: 'task2',
					dep: [],
					fn: function () {}
				}
			};
			var runOneFn = function () {};
			var orchestrator = {};
			var runOptions = {};
			var args = makeArgs(tasks, runOneFn, orchestrator, runOptions);

			// act
			makeRunOneFn(args, function (err) {

				// assert
				should.exist(tasks.task1.fnAuto);
				(typeof tasks.task1.fnAuto).should.equal('function');
				should.exist(tasks.task2.fnAuto);
				(typeof tasks.task2.fnAuto).should.equal('function');
				should.not.exist(err);

				done();
			});
		});

		it('runOneFn has valid bound args', function (done) {
			// arrange
			var tasks = {
				theTask: {
					name: 'theTask',
					dep: [],
					fn: function () {}
				}
			};
			var runOneFn = function (args, cb) {

				// assert
				args.orchestrator.should.equal(orchestrator);
				args.task.should.equal(tasks.theTask);

				cb(null);
			};
			var orchestrator = {};
			var runOptions = {};
			var args = makeArgs(tasks, runOneFn, orchestrator, runOptions);

			// act
			makeRunOneFn(args, function (err) {

				// assert
				should.not.exist(err);

				// act: run the created fn
				tasks.theTask.fnAuto(function () {

					done();
				});
			});
		});

	});
});
