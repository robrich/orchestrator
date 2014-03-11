/*global describe:false, it:false */

'use strict';

var resolveBuilderDependencies = require('../lib/run/resolveBuilderDependencies');
var parallel = require('../lib/builder/parallel');
var series = require('../lib/builder/series');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('resolveBuilderDependencies()', function() {

		var makeArgs = function (builder, tasks) {
			return {
				builder: builder,
				runTasks: tasks
			};
		};

		var makeTask = function (name) {
			// FRAGILE: ASSUME: before: [], after: [], fn: function () {}
			return {
				name: name,
				before: [],
				after: [],
				fn: function () {}
			};
		};

		var verifyDependencies = function (task, depArray) {
			var message = task.name+' -> expected: \''+depArray.join('\', \'')+
				'\' actual: \''+task.before.join('\', \'')+'\'';
			task.before.length.should.equal(depArray.length, message);
			var i = 0;
			for (i = 0; i < task.before.length; i++) {
				task.before[i].should.equal(depArray[i], message);
			}
		};

		it('runs task successfully', function(done) {

			// arrange
			var builder = series();
			var tasks = {};
			var args = makeArgs(builder, tasks);

			// act
			resolveBuilderDependencies(args, function (err) {

				// assert
				should.not.exist(err);

				done();
			});
		});

		it('should resolve dependencies', function(done) {

			// arrange
			var builder = series('one', parallel('two', 'three'), 'four');
			var tasks = {
				one: makeTask('one'),
				two: makeTask('two'),
				three: makeTask('three'),
				four: makeTask('four')
			};
			var args = makeArgs(builder, tasks);

			// act
			resolveBuilderDependencies(args, function (err) {

				// assert
				verifyDependencies(tasks.one, []);
				verifyDependencies(tasks.two, ['one']);
				verifyDependencies(tasks.three, ['one']);
				verifyDependencies(tasks.four, ['two', 'three']);
				should.not.exist(err);

				done();
			});
		});

	});
});
