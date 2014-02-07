/*jshint node:true */
/*global describe:false, it:false */

'use strict';

var timeTask = require('../lib/runOne/timeTask');
var Q = require('q');
var map = require('map-stream');
var es = require('event-stream');
var should = require('should');
require('mocha');

describe('lib/runOne/', function() {
	describe('timeTask()', function() {
		var defaultTaskTimeout = 10;

		it('runs task successfully', function(done) {

			// arrange
			var a = 0;
			var task = function(cb) {
				a++;
				cb(null);
			};
			var taskName = 'good-task';

			// act
			timeTask(task, taskName, defaultTaskTimeout, function (err/*, meta*/) {

				// assert
				should.not.exist(err);
				a.should.equal(1);

				done();
			});
		});

		it('runs errored task successfully', function(done) {

			// arrange
			var a = 0;
			var expectedErr = new Error('the error');
			var task = function(cb) {
				a++;
				cb(expectedErr);
			};
			var taskName = 'err-task';

			// act
			timeTask(task, taskName, defaultTaskTimeout, function (err/*, meta*/) {

				// assert
				should.exist(err);
				err.should.equal(expectedErr);
				a.should.equal(1);

				done();
			});
		});

		it('aborts task on timeout', function(done) {

			// arrange
			var taskTimeout = 4;
			var a = 0;
			var task = function(cb) {
				a++;
				setTimeout(function () {
					cb();
				}, taskTimeout*1.5);
			};
			var taskName = 'timeout-task';

			// act
			timeTask(task, taskName, taskTimeout, function (err, meta) {
				a++;

				// assert
				should.exist(err);
				err.message.indexOf('timed out').should.be.above(-1);
				should.exist(meta);
				should.exist(meta.runMethod);
				meta.runMethod.should.equal('timeout');
			});

			setTimeout(function () {

				// assert
				a.should.equal(2);

				done();
			}, taskTimeout*2);
		});

		it('passes error on timeout then fail', function(done) {

			// arrange
			var taskTimeout = 4;
			var expectedErr = new Error('expected');
			var expectedRunMethod = 'the_runMethod';
			var a = 0;
			var task = function(cb) {
				a++;
				setTimeout(function () {
					cb(expectedErr, expectedRunMethod);
				}, taskTimeout*1.5);
			};
			var taskName = 'timeout-task';

			// act
			timeTask(task, taskName, taskTimeout, function (err, meta) {
				a++;

				// assert
				// a === 2 (the timeout callback) is tested above
				if (a === 3) {
					should.exist(err);
					err.should.equal(expectedErr);
					should.exist(meta);
					should.exist(meta.runMethod);
					meta.runMethod.should.equal(expectedRunMethod);
				}
			});

			setTimeout(function () {

				// assert
				a.should.equal(3);

				done();
			}, taskTimeout*2);
		});

		it('passes error on done too many times', function(done) {

			// arrange
			var taskTimeout = 4;
			var a = 0;
			var task = function(cb) {
				a++;
				cb();
				cb();
			};
			var taskName = 'multi-done';

			// act
			timeTask(task, taskName, taskTimeout, function (err, meta) {
				a++;

				// assert
				if (a === 2) {
					// first callback
					should.not.exist(err);
				} else if (a === 3) {
					// second callback
					should.exist(err);
					err.message.indexOf('too many times').should.be.above(-1); // FRAGILE:
				}
			});

			setTimeout(function () {

				// assert
				a.should.equal(3);

				done();
			}, taskTimeout*2);
		});

		it('done successfully stops timeout timer', function(done) {
			// e.g. the timeout timer doesn't call done again

			// arrange
			var taskTimeout = 4;
			var a = 0;
			var task = function(cb) {
				a++;
				cb();
			};
			var taskName = 'stop-timer';

			// act
			timeTask(task, taskName, taskTimeout, function (err, meta) {
				a++;

				// assert
				should.not.exist(err);
			});

			setTimeout(function () {

				// assert
				a.should.equal(2);

				done();
			}, taskTimeout*2);
		});

		it('run method passes through', function(done) {
			// e.g. the timeout timer doesn't call done again

			// arrange
			var a = 0;
			var expectedRunMethod = 'something';
			var task = function(cb) {
				a++;
				cb(null, expectedRunMethod);
			};
			var taskName = 'run-method';

			// act
			timeTask(task, taskName, defaultTaskTimeout, function (err, meta) {
				a++;

				// assert
				should.exist(meta);
				meta.runMethod.should.equal(expectedRunMethod);

				done();
			});
		});

		it('time passes through', function(done) {
			// e.g. the timeout timer doesn't call done again

			// arrange
			var taskTimeout = 50;
			var task = function(cb) {
				setTimeout(function () {
					cb(null);
				}, taskTimeout);
			};
			var taskName = 'timing';

			// act
			timeTask(task, taskName, taskTimeout, function (err, meta) {

				// assert
				should.exist(meta);
				meta.duration.should.be.above(taskTimeout/1000);
				meta.hrDuration[0].should.equal(0); // it's a process.hrtime

				done();
			});
		});

	});
});
