/*global describe:false, it:false */

'use strict';

var normalizeDependencies = require('../lib/run/normalizeDependencies');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('normalizeDependencies()', function() {

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
			normalizeDependencies(args, function (err) {

				// assert
				should.not.exist(err);

				done();
			});
		});

		it('copies before array (arrays are different)', function(done) {

			// arrange
			var taskName = 'task';
			var depName = 'dep';
			var tasks = {
				task: {
					name: taskName,
					before: [depName],
					after: []
				},
				dep: {
					name: depName,
					before: [],
					after: []
				}
			};
			var args = makeArgs(tasks);

			// act
			normalizeDependencies(args, function (err) {

				// assert
				tasks.task.dep.length.should.equal(1);
				tasks.task.dep[0].should.equal(depName);
				tasks.task.before.push('something');
				tasks.task.dep.length.should.equal(1); // didn't change, lazy man's "arrays are different"
				tasks.dep.dep.length.should.equal(0);
				tasks.dep.before.push('something');
				tasks.dep.dep.length.should.equal(0); // didn't change, lazy man's "arrays are different"
				should.not.exist(err);

				done();
			});
		});

		it('resolves after array (arrays are different)', function(done) {

			// arrange
			var taskName = 'task';
			var depName = 'dep';
			var tasks = {
				task: {
					name: taskName,
					before: [],
					after: []
				},
				dep: {
					name: depName,
					before: [],
					after: [taskName]
				}
			};
			var args = makeArgs(tasks);

			// act
			normalizeDependencies(args, function (err) {

				// assert
				tasks.task.dep.length.should.equal(1);
				tasks.task.dep[0].should.equal(depName);
				tasks.task.before.push('something');
				tasks.task.dep.length.should.equal(1); // didn't change, lazy man's "arrays are different"
				tasks.dep.dep.length.should.equal(0);
				tasks.dep.before.push('something');
				tasks.dep.dep.length.should.equal(0); // didn't change, lazy man's "arrays are different"
				should.not.exist(err);

				done();
			});
		});

		it('notes missing after task', function(done) {

			// arrange
			var taskName = 'task';
			var depName = 'dep';
			var tasks = {
				task: {
					name: taskName,
					before: [],
					after: [depName]
				}
			};
			var args = makeArgs(tasks);

			// act
			normalizeDependencies(args, function (err) {

				// assert
				should.exist(err);
				err.missingTasks.length.should.equal(1);
				err.missingTasks[0].should.equal(depName);

				done();
			});
		});

		it('doesn\'t duplicate dependencies', function(done) {

			// arrange
			var taskName = 'task';
			var depName = 'dep';
			var tasks = {
				task: {
					name: taskName,
					before: [depName],
					after: []
				},
				dep: {
					name: depName,
					before: [],
					after: [taskName]
				}
			};
			var args = makeArgs(tasks);

			// act
			normalizeDependencies(args, function (err) {

				// assert
				tasks.task.dep.length.should.equal(1);
				tasks.task.dep[0].should.equal(depName);
				tasks.task.before.push('something');
				tasks.task.dep.length.should.equal(1); // didn't change, lazy man's "arrays are different"
				tasks.dep.dep.length.should.equal(0);
				tasks.dep.before.push('something');
				tasks.dep.dep.length.should.equal(0); // didn't change, lazy man's "arrays are different"
				should.not.exist(err);

				done();
			});
		});

	});
});
