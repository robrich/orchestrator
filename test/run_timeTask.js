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
			timeRun.start(function (err, startArgs) {

				// act
				timeRun.end(function (err/*, endArgs*/) {

					// assert
					should.not.exist(err);

					done();
				}, startArgs);
			}, args);
		});

		it('passes args to callback', function(done) {

			// arrange
			var args = {};

			// act
			timeRun.start(function (err, startArgs) {

				// assert
				should.not.exist(err);
				startArgs.should.equal(args);

				// act
				timeRun.end(function (err, endArgs) {

					// assert
					should.not.exist(err);
					endArgs.should.equal(args);

					done();
				}, startArgs);
			}, args);
		});

		it('sets start time', function(done) {

			// arrange
			var args = {};

			// act
			timeRun.start(function (/*err, startArgs*/) {

				// assert
				should.exist(args.start);
				Array.isArray(args.start).should.equal(true);

				done();
			}, args);
		});

		it('sets duration', function(done) {

			// arrange
			var args = {};

			// act
			timeRun.start(function (err, startArgs) {
				timeRun.end(function (/*err, endArgs*/) {

					// assert
					should.exist(args.duration);
					Array.isArray(args.duration).should.equal(true);

					done();
				}, startArgs);
			}, args);
		});

		it('duration makes sense', function(done) {

			// arrange
			var duration = 10; // how long are we waiting between start and stop?
			var lag = 15; // how many ms should this test take?
			var lowLag = 1; // not sure how setTimeout could happen faster than duration but ok
			var args = {};

			// act
			timeRun.start(function (err, startArgs) {
				setTimeout(function () {
					timeRun.end(function (/*err, endArgs*/) {

						// assert
						args.duration[0].should.equal(0);
						(args.duration[1]/10e5).should.be.above(duration-lowLag);
						(args.duration[1]/10e5).should.be.below(duration+lag);

						done();
					}, startArgs);
				}, duration);
			}, args);
		});

	});
});
