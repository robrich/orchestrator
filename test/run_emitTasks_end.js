/*global describe:false, it:false */

'use strict';

var emitTasks = require('../lib/run/emitTasks');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('emitTasks.end()', function() {

		var makeArgs = function (taskNames, emit) {
			return {
				runTaskNames: taskNames, // the taskNames to #run()
				orchestrator: {
					emit: emit
				},
				emitArgs: {
				}
			};
		};

		it('runs task successfully', function(done) {

			// arrange
			var tasks = [];
			var emit = function () {};
			var inErr;
			var args = makeArgs(tasks, emit);

			// act
			emitTasks.end(inErr, args, function (err) {

				// assert
				should.not.exist(err);

				done();
			});
		});

		it('emits end event', function (done) {

			// arrange
			var a = 0;
			var tasks = [];
			var emit = function (name/*, emitArgs*/) {
				a++;
				name.should.equal('end');
			};
			var inErr;
			var args = makeArgs(tasks, emit);

			// act
			emitTasks.end(inErr, args, function (/*err*/) {

				// assert
				a.should.equal(1);

				done();
			});
		});

		it('emits error and end event', function (done) {

			// arrange
			var a = 0;
			var tasks = [];
			var inErr = 'errored task event';
			var emit = function (name/*, emitArgs*/) {
				a++;
				switch(name) {
					case 'error':
						// great
						break;
					case 'end':
						// great
						break;
					default:
						// fail
						name.should.equal('error');
						break;
				}
			};
			var args = makeArgs(tasks, emit);

			// act
			emitTasks.end(inErr, args, function (/*err*/) {

				// assert
				a.should.equal(2); // both taskErorr and end

				done();
			});
		});

		it('emits err in args', function (done) {

			// arrange
			var a = 0;
			var tasks = [];
			var inErr = 'the error';
			var emit = function (name, emitArgs) {
				a++;
				emitArgs.err.should.equal(inErr);
			};
			var args = makeArgs(tasks, emit);
			args.duration = 'fake duration';

			// act
			emitTasks.end(inErr, args, function (/*err*/) {

				// assert
				a.should.equal(2);

				done();
			});
		});

		it('sets message', function (done) {

			// arrange
			var a = 0;
			var tasks = ['the','task','names'];
			var inErr;
			var emit = function (name, emitArgs) {
				a++;

				// assert
				emitArgs.message.should.equal('succeeded the, task, names');
			};
			var args = makeArgs(tasks, emit);

			// act
			emitTasks.end(inErr, args, function (/*err*/) {

				// assert
				a.should.equal(1);

				done();
			});
		});

	});
});
