/*global describe:false, it:false */

'use strict';

var pluckArgs = require('../lib/run/pluckArgs');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('pluckArgs()', function() {

		// runArgs is run()'s arguments -- think `Orchestrator.run.apply(Orchestrator, runArgs)`
		var makeArgs = function () {
			return {
				runArgs: Array.prototype.slice.call(arguments, 0)
			};
		};

		it('runs task successfully', function(done) {

			// arrange
			var args = makeArgs(); // empty

			// act
			pluckArgs(args, function (err) {

				// assert
				should.not.exist(err);
				should.exist(args.runTaskNames);

				done();
			});
		});

		it('successfully does nothing', function (done) {

			// arrange
			var args = makeArgs(); // empty

			// act
			pluckArgs(args, function (err) {

				// assert
				should.exist(args.runTaskNames);
				args.runTaskNames.length.should.equal(0);
				should.not.exist(args.doneCallback);
				should.not.exist(err);

				done();
			});
		});

		it('takes task names as strings', function (done) {

			// arrange
			var args = makeArgs('zero','one','two');

			// act
			pluckArgs(args, function (err) {

				// assert
				should.exist(args.runTaskNames);
				args.runTaskNames.length.should.equal(3);
				args.runTaskNames[0].should.equal('zero');
				args.runTaskNames[1].should.equal('one');
				args.runTaskNames[2].should.equal('two');
				should.not.exist(args.doneCallback);
				should.not.exist(err);

				done();
			});
		});

		it('takes task names as an array', function (done) {
			
			// arrange
			var args = makeArgs(['zero','one','two']);

			// act
			pluckArgs(args, function (err) {

				// assert
				should.exist(args.runTaskNames);
				args.runTaskNames.length.should.equal(3);
				args.runTaskNames[0].should.equal('zero');
				args.runTaskNames[1].should.equal('one');
				args.runTaskNames[2].should.equal('two');
				should.not.exist(args.doneCallback);
				should.not.exist(err);

				done();
			});
		});

		it('does not accept object task names', function (done) {
			
			// arrange
			var args = makeArgs('zero', {one:'two'});

			// act
			pluckArgs(args, function (err) {

				// assert
				should.exist(args.runTaskNames);
				args.runTaskNames.length.should.equal(0);
				should.not.exist(args.doneCallback);
				should.exist(err);
				err.taskInvalid.should.equal(true);

				done();
			});
		});

		it('does not accept function task names', function (done) {
			
			// arrange
			var args = makeArgs('zero', function () {}, {one:'two'});

			// act
			pluckArgs(args, function (err) {

				// assert
				should.exist(args.runTaskNames);
				args.runTaskNames.length.should.equal(0);
				should.not.exist(args.doneCallback);
				should.exist(err);
				err.taskInvalid.should.equal(true);

				done();
			});
		});

		it('grabs callback function if only arg', function (done) {
			
			// arrange
			var expectedCallback = function () {};
			var args = makeArgs(expectedCallback);

			// act
			pluckArgs(args, function (err) {

				// assert
				should.exist(args.runTaskNames);
				args.runTaskNames.length.should.equal(0);
				should.exist(args.doneCallback);
				args.doneCallback.should.equal(expectedCallback);
				should.not.exist(err);

				done();
			});
		});

		it('grabs callback function if after task list', function (done) {
			
			// arrange
			var expectedCallback = function () {};
			var args = makeArgs('zero','one','two', expectedCallback);

			// act
			pluckArgs(args, function (err) {

				// assert
				should.exist(args.runTaskNames);
				args.runTaskNames.length.should.equal(3);
				args.runTaskNames[0].should.equal('zero');
				args.runTaskNames[1].should.equal('one');
				args.runTaskNames[2].should.equal('two');
				should.exist(args.doneCallback);
				args.doneCallback.should.equal(expectedCallback);
				should.not.exist(err);

				done();
			});
		});

		it('grabs callback function if after task array', function (done) {
			
			// arrange
			var expectedCallback = function () {};
			var args = makeArgs(['zero','one','two'], expectedCallback);

			// act
			pluckArgs(args, function (err) {

				// assert
				should.exist(args.runTaskNames);
				args.runTaskNames.length.should.equal(3);
				args.runTaskNames[0].should.equal('zero');
				args.runTaskNames[1].should.equal('one');
				args.runTaskNames[2].should.equal('two');
				should.exist(args.doneCallback);
				args.doneCallback.should.equal(expectedCallback);
				should.not.exist(err);

				done();
			});
		});

	});
});
