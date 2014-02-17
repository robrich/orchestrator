/*global describe:false, it:false */

'use strict';

var shimToAuto = require('../lib/run/shimToAuto');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('shimToAuto()', function() {

		var makeArgs = function (tasks) {
			return {
				runTasks: tasks
			};
		};

		it('runs task successfully', function(done) {

			// arrange
			var tasks = {};
			var args = makeArgs(tasks);

			// act
			shimToAuto(args, function (err) {

				// assert
				should.not.exist(err);
				should.exist(args.runAutoTasks);

				done();
			});
		});

		it('builds async.auto() fn for two tasks', function (done) {

			// arrange
			var tasks = {
				task1: {
					name: 'task1',
					before: [],
					after: [],
					fnAuto: function () {}
				},
				task2: {
					name: 'task2',
					before: [],
					after: [],
					fnAuto: function () {}
				}
			};
			var args = makeArgs(tasks);

			// act
			shimToAuto(args, function (err) {

				// assert
				should.exist(args.runAutoTasks);
				Object.keys(args.runAutoTasks).length.should.equal(2);
				Array.isArray(args.runAutoTasks.task1).should.equal(true);
				Array.isArray(args.runAutoTasks.task2).should.equal(true);
				should.not.exist(err);

				done();
			});
		});

		it('async.auto() task built correctly', function (done) {
			
			// arrange
			var tasks = {
				theTask: {
					name: 'theTask',
					before: ['theDep'],
					after: [],
					fnAuto: function () {}
				}
			};
			var args = makeArgs(tasks);

			// act
			shimToAuto(args, function (err) {

				// assert
				var autoTask = args.runAutoTasks.theTask;
				autoTask[0].should.equal('theDep');
				autoTask[1].should.equal(tasks.theTask.fnAuto);
				should.not.exist(err);

				done();
			});
		});

		it('dependency array left intact', function (done) {
			
			// arrange
			var tasks = {
				theTask: {
					name: 'theTask',
					before: ['theDep'],
					after: [],
					fnAuto: function () {}
				}
			};
			var args = makeArgs(tasks);

			// act
			shimToAuto(args, function (err) {

				// assert
				tasks.theTask.before.length.should.equal(1);
				tasks.theTask.before[0].should.equal('theDep');
				should.not.exist(err);

				done();
			});
		});

	});
});
