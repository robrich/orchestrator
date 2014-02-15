/*global describe:false, it:false */

'use strict';

var cloneTasks = require('../lib/run/cloneTasks');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('cloneTasks()', function() {

		var makeArgs = function (tasks) {
			return {
				runTasks: tasks // the tasks to #run()
			};
		};

		it('runs task successfully', function(done) {

			// arrange
			var args = makeArgs({});

			// act
			cloneTasks(args, function (err) {

				// assert
				should.not.exist(err);

				done();
			});
		});

		it('duplicates two standard tassk', function(done) {

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
			}
			var args = makeArgs(tasks);

			// act
			cloneTasks(args, function (err) {

				// assert
				should.exist(args.runTasks);
				Object.keys(args.runTasks).length.should.equal(2);
				args.runTasks.task1.name.should.equal(tasks.task1.name);
				args.runTasks.task2.name.should.equal(tasks.task2.name);
				// change it and make sure the other didn't change -- lazy man's '== but not ==='
				tasks.task1.different = true;
				tasks.task2.different = true;
				should.not.exist(args.runTasks.task1.different);
				should.not.exist(args.runTasks.task2.different);

				should.not.exist(err);

				done();
			});
		});

		it('duplicates abnormal task', function(done) {
			
			// arrange
			var tasks = {
				task1: {
					name: 'task1',
					dep: [],
					fn: function () {},
					other: 'content',
					gets: 'cloned'
				},
				task2: {
					name: 'task2',
					dep: [],
					fn: function () {},
					interesting: 'content',
					doubled: 'here'
				}
			}
			var args = makeArgs(tasks);

			// act
			cloneTasks(args, function (err) {

				// assert
				should.exist(args.runTasks);
				Object.keys(args.runTasks).length.should.equal(2);
				args.runTasks.task1.name.should.equal(tasks.task1.name);
				args.runTasks.task2.name.should.equal(tasks.task2.name);
				// do the weird properties still exist?
				args.runTasks.task1.other.should.equal(tasks.task1.other);
				args.runTasks.task1.gets.should.equal(tasks.task1.gets);
				args.runTasks.task2.interesting.should.equal(tasks.task2.interesting);
				args.runTasks.task2.doubled.should.equal(tasks.task2.doubled);
				// change it and make sure the other didn't change -- lazy man's '== but not ==='
				tasks.task1.different = true;
				tasks.task2.different = true;
				should.not.exist(args.runTasks.task1.different);
				should.not.exist(args.runTasks.task2.different);

				should.not.exist(err);

				done();
			});
		});

		it('clones dependency array', function(done) {
			
			// arrange
			var tasks = {
				task1: {
					name: 'task1',
					dep: ['stuff'],
					fn: function () {}
				},
				task2: {
					name: 'task2',
					dep: ['lots','of','dependencies'],
					fn: function () {}
				}
			}
			var args = makeArgs(tasks);

			// act
			cloneTasks(args, function (err) {

				// assert
				should.exist(args.runTasks);
				Object.keys(args.runTasks).length.should.equal(2);
				args.runTasks.task1.name.should.equal(tasks.task1.name);
				args.runTasks.task2.name.should.equal(tasks.task2.name);
				args.runTasks.task1.dep.length.should.equal(tasks.task1.dep.length);
				args.runTasks.task2.dep.length.should.equal(tasks.task2.dep.length);
				args.runTasks.task1.dep[0].should.equal(tasks.task1.dep[0]);
				args.runTasks.task2.dep[2].should.equal(tasks.task2.dep[2]);
				// change it and make sure the other didn't change -- lazy man's '== but not ==='
				tasks.task1.different = true;
				tasks.task2.different = true;
				should.not.exist(args.runTasks.task1.different);
				should.not.exist(args.runTasks.task2.different);
				tasks.task1.dep.push('another');
				tasks.task2.dep.push('another');
				args.runTasks.task1.dep.length.should.not.equal(tasks.task1.dep.length);
				args.runTasks.task2.dep.length.should.not.equal(tasks.task2.dep.length);

				should.not.exist(err);

				done();
			});
		});

	});
});
