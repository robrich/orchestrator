/*global describe:false, it:false */

'use strict';

var validateArgs = require('../lib/run/validateArgs');
var series = require('../lib/builder/series');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('validateArgs()', function() {

		// runArgs is run()'s arguments -- think `Orchestrator.run.apply(Orchestrator, runArgs)`
		var makeArgs = function (builder, runOptions, doneCallback) {
			return {
				builder: builder,
				runOptions: runOptions,
				doneCallback: doneCallback
			};
		};

		it('runs task successfully', function(done) {

			// arrange
			var args = makeArgs(series()); // empty

			// act
			validateArgs(args, function (err) {

				// assert
				should.not.exist(err);
				should.exist(args.runTaskNames);

				done();
			});
		});

		it('should accept empty builder, undefined runOptions and doneCallback', function (done) {

			// arrange
			var builder = series(); // empty
			var runOptions = null;
			var doneCallback = null;
			var args = makeArgs(builder, runOptions, doneCallback);

			// act
			validateArgs(args, function (err) {

				// assert
				args.runTaskNames.length.should.equal(0);
				should.not.exist(args.doneCallback);
				should.not.exist(err);

				done();
			});
		});

		it('should accept full builder, runOptions object, and doneCallback function', function (done) {

			// arrange
			var builder = series('one', 'two');
			var runOptions = {};
			var doneCallback = function () {};
			var args = makeArgs(builder, runOptions, doneCallback);

			// act
			validateArgs(args, function (err) {

				// assert
				args.runTaskNames.length.should.equal(2);
				args.runOptions.should.equal(runOptions);
				args.doneCallback.should.equal(doneCallback);
				should.not.exist(err);

				done();
			});
		});

		it('should fail on invalid builder', function (done) {

			// arrange
			var builder = 42; // invalid
			var runOptions = null;
			var doneCallback = null;
			var args = makeArgs(builder, runOptions, doneCallback);

			// act
			validateArgs(args, function (err) {

				// assert
				should.exist(err);
				err.taskInvalid.should.equal(true);

				done();
			});
		});

		it('should fail on invalid options', function (done) {

			// arrange
			var builder = series('one');
			var runOptions = 42;
			var doneCallback = null;
			var args = makeArgs(builder, runOptions, doneCallback);

			// act
			validateArgs(args, function (err) {

				// assert
				should.exist(err);
				err.optionsInvalid.should.equal(true);

				done();
			});
		});

		it('should fail on invalid callback', function (done) {

			// arrange
			var builder = series('one');
			var runOptions = null;
			var doneCallback = 42;
			var args = makeArgs(builder, runOptions, doneCallback);

			// act
			validateArgs(args, function (err) {

				// assert
				should.exist(err);
				err.callbackInvalid.should.equal(true);

				done();
			});
		});

	});
});
