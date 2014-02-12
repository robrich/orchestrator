/*global describe:false, it:false */

'use strict';

var timeRun = require('../lib/run/timeRun');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('timeRun()', function() {

		it('runs task successfully', function(done) {

			// arrange
			var args = {};

			// act
			timeRun.start(args, function (err) {

				// assert
				should.not.exist(err);

				// act
				timeRun.end(args, function (err) {

					// assert
					should.not.exist(err);

					done();
				});
			});
		});

		it('sets start time', function(done) {

			// arrange
			var args = {};

			// act
			timeRun.start(args, function (/*err*/) {

				// assert
				should.exist(args.start);
				Array.isArray(args.start).should.equal(true);

				done();
			});
		});

		it('sets duration', function(done) {

			// arrange
			var args = {};

			// act
			timeRun.start(args, function (/*err*/) {
				timeRun.end(args, function (/*err*/) {

					// assert
					should.exist(args.duration);
					Array.isArray(args.duration).should.equal(true);

					done();
				});
			});
		});

		it('duration makes sense', function(done) {

			// arrange
			var duration = 10; // how long are we waiting between start and stop?
			var lag = 15; // how many ms should this test take?
			var lowLag = 1; // not sure how setTimeout could happen faster than duration but ok
			var args = {};

			// act
			timeRun.start(args, function (/*err*/) {
				setTimeout(function () {
					timeRun.end(args, function (/*err*/) {

						// assert
						args.duration[0].should.equal(0);
						(args.duration[1]/10e5).should.be.above(duration-lowLag);
						(args.duration[1]/10e5).should.be.below(duration+lag);

						done();
					});
				}, duration);
			});
		});

	});
});
