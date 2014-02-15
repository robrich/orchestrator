/*global describe:false, it:false */

'use strict';

var validateTasks = require('../lib/run/validateTasks');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('validateTasks()', function() {

		var makeArgs = function (tasks) {
			return {
				runTasks: tasks // the tasks to #run()
			};
		};

		it('runs task successfully', function(done) {

			// arrange
			var args = makeArgs({});

			// act
			validateTasks(args, function (err) {

				// assert
				should.not.exist(err);

				done();
			});
		});

		it('finds two tasks', function(done) {

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
			var args = makeArgs(tasks);

			// act
			validateTasks(args, function (err) {

				// assert
				should.exist(args.runTasks);
				Object.keys(args.runTasks).length.should.equal(2);
				args.runTasks.task1.should.equal(tasks.task1);
				args.runTasks.task2.should.equal(tasks.task2);
				should.not.exist(err);

				done();
			});
		});

		it('finds no tasks', function(done) {

			// arrange
			var tasks = {};
			var args = makeArgs(tasks);

			// act
			validateTasks(args, function (err) {

				// assert
				should.exist(args.runTasks);
				Object.keys(args.runTasks).length.should.equal(0);
				should.not.exist(err);

				done();
			});
		});

		it('error on invalid task', function(done) {

			// arrange
			var tasks = {
				test: {
					name: 'test'
				}
			};
			var args = makeArgs(tasks);

			// act
			validateTasks(args, function (err) {

				// assert
				should.exist(err);
				should.exist(err.invalidTask);
				err.invalidTask.should.equal(true);

				done();
			});
		});

		it('error on name mismatch', function(done) {

			// arrange
			var tasks = {
				test: {
					name: 'not-test'
				}
			};
			var args = makeArgs(tasks);

			// act
			validateTasks(args, function (err) {

				// assert
				should.exist(err);
				should.exist(err.invalidTask);
				err.invalidTask.should.equal(true);

				done();
			});
		});

	});
});
