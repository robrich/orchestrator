/*global describe:false, it:false */

'use strict';

var timeTask = require('../lib/runOne/timeTask');
var makeArgs = require('../lib/runOne/args');
var should = require('should');
require('mocha');

describe('lib/runOne/', function() {
	describe('timeTask()', function() {
		var fakeOrchestrator = {};

		it('runs task successfully', function(done) {

			// arrange
			var task = {};
			var args = makeArgs(task, fakeOrchestrator);

			// act
			timeTask.start(args, function (err) {

				// assert
				should.not.exist(err);

				// act
				timeTask.end(args, function (err) {

					// assert
					should.not.exist(err);

					done();
				});
			});
		});

		it('sets start time', function(done) {

			// arrange
			var task = {};
			var args = makeArgs(task, fakeOrchestrator);

			// act
			timeTask.start(args, function (/*err*/) {

				// assert
				should.exist(task.start);
				Array.isArray(task.start).should.equal(true);

				done();
			});
		});

		it('sets duration', function(done) {

			// arrange
			var task = {};
			var args = makeArgs(task, fakeOrchestrator);

			// act
			timeTask.start(args, function (/*err*/) {
				timeTask.end(args, function (/*err*/) {

					// assert
					should.exist(task.duration);
					Array.isArray(task.duration).should.equal(true);

					done();
				});
			});
		});

		it('duration makes sense', function(done) {

			// arrange
			var duration = 10; // how long are we waiting between start and stop?
			var lag = 15; // how many ms should this test take?
			var lowLag = 1; // not sure how setTimeout could happen faster than duration but ok
			var task = {};
			var args = makeArgs(task, fakeOrchestrator);

			// act
			timeTask.start(args, function (/*err*/) {
				setTimeout(function () {
					timeTask.end(args, function (/*err*/) {

						// assert
						task.duration[0].should.equal(0);
						(task.duration[1]/10e5).should.be.above(duration-lowLag);
						(task.duration[1]/10e5).should.be.below(duration+lag);

						done();
					});
				}, duration);
			});
		});

	});
});
