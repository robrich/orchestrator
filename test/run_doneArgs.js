/*global describe:false, it:false */

'use strict';

var doneArgsFn = require('../lib/run/doneArgs');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('doneArgs()', function() {

		var makeArgs = function (taskNames, duration) {
			return {
				runTaskNames: taskNames, // the taskNames to #run()
				duration: duration
			};
		};

		it('runs task successfully', function(done) {

			// arrange
			var tasks = [];
			var duration = [];
			var inErr;
			var args = makeArgs(tasks, duration);

			// act
			doneArgsFn(inErr, args, function (err) {

				// assert
				should.not.exist(err);

				done();
			});
		});

		it('builds doneArgs', function (done) {

			// arrange
			var tasks = [];
			var duration; // undefined
			var inErr;
			var args = makeArgs(tasks, duration);

			// act
			doneArgsFn(inErr, args, function (/*err*/) {

				// assert
				should.exist(args.doneArgs);
				should.exist(args.doneArgs.message);
				args.doneArgs.tasks.should.equal(tasks);
				should.not.exist(args.doneArgs.duration);

				done();
			});
		});

		it('builds doneArgs with err', function (done) {

			// arrange
			var tasks = [];
			var duration = ['fake','duration'];
			var inErr = 'errored task event';
			var args = makeArgs(tasks, duration);

			// act
			doneArgsFn(inErr, args, function (/*err*/) {

				// assert
				should.exist(args.doneArgs.message);
				args.doneArgs.tasks.should.equal(tasks);
				args.doneArgs.duration.should.equal(duration);
				args.doneArgs.err.should.equal(inErr);

				done();
			});
		});

		it('sets message', function (done) {

			// arrange
			var tasks = ['the','task','names'];
			var duration = ['fake','duration'];
			var inErr;
			var args = makeArgs(tasks, duration);

			// act
			doneArgsFn(inErr, args, function (/*err*/) {

				// assert
				args.doneArgs.message.should.equal('succeeded the, task, names');

				done();
			});
		});

	});
});
