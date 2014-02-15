/*global describe:false, it:false */

'use strict';

var emitTasks = require('../lib/run/emitTasks');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('emitTasks.start()', function() {

		var makeArgs = function (taskNames, emit) {
			return {
				runTaskNames: taskNames, // the taskNames to #run()
				orchestrator: {
					emit: emit
				}
			};
		};

		it('runs task successfully', function(done) {

			// arrange
			var tasks = [];
			var emit = function () {};
			var args = makeArgs(tasks, emit);

			// act
			emitTasks.start(args, function (err) {

				// assert
				should.not.exist(err);

				done();
			});
		});

		it('emits start event', function (done) {

			// arrange
			var a = 0;
			var tasks = [];
			var emit = function (name/*, emitArgs*/) {
				a++;
				name.should.equal('start');
			};
			var args = makeArgs(tasks, emit);

			// act
			emitTasks.start(args, function (/*err*/) {

				// assert
				a.should.equal(1);

				done();
			});
		});

		it('emits task names in args', function (done) {

			// arrange
			var a = 0;
			var tasks = ['the','args','are','here'];
			var emit = function (name, emitArgs) {
				a++;
				emitArgs.tasks.should.equal(tasks);
			};
			var args = makeArgs(tasks, emit);

			// act
			emitTasks.start(args, function (/*err*/) {

				// assert
				a.should.equal(1);

				done();
			});
		});

		it('sets message', function (done) {

			// arrange
			var a = 0;
			var tasks = ['the','args','are','here'];
			var emit = function (name, emitArgs) {
				a++;

				// assert
				emitArgs.message.should.equal('running the, args, are, here');
			};
			var args = makeArgs(tasks, emit);

			// act
			emitTasks.start(args, function (/*err*/) {

				// assert
				a.should.equal(1);

				done();
			});
		});

	});
});
