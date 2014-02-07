/*jshint node:true */
/*global describe:false, it:false */

'use strict';

var emitTask = require('../lib/runOne/emitTask');
var should = require('should');
require('mocha');

describe('lib/runOne/', function() {
	describe('emitTask()', function() {
		var defaultTaskTimeout = 100;
		var defaultEmit = function () {};

		it('runs task successfully', function(done) {

			// arrange
			var a = 0;
			var taskName = 'good-task';
			var task = {
				name: taskName,
				fn: function(cb) {
					a++;
					cb(null);
				}
			};

			// act
			emitTask(task, defaultTaskTimeout, defaultEmit)(function (err) {

				// assert
				should.not.exist(err); // it didn't error
				a.should.equal(1); // it ran

				done();
			});
		});

		it('passes error', function(done) {

			// arrange
			var a = 0;
			var taskName = 'err-task';
			var expectedErr = {message:'this is an error'};
			var task = {
				name: taskName,
				fn: function(cb) {
					a++;
					cb(expectedErr);
				}
			};

			// act
			emitTask(task, defaultTaskTimeout, defaultEmit)(function (err) {

				// assert
				should.exist(err);
				err.should.equal(expectedErr);
				a.should.equal(1); // it ran

				done();
			});
		});

		it('emits task_start and task_end events', function(done) {

			// arrange
			var a = 0;
			var taskName = 'emit-good-task';
			var task = {
				name: taskName,
				fn: function(cb) {
					cb(null);
				}
			};
			var emit = function (name, args) {
				switch(name) {
					case 'task_start':
						a++;
						break;
					case 'task_end':
						a++;
						break;
					default:
						throw new Error('invalid event: '+name);
				}
			};

			// act
			emitTask(task, defaultTaskTimeout, emit)(function () {

				// assert
				a.should.equal(2); // it got both events

				done();
			});
		});

		it('emits task_start and task_error events', function(done) {

			// arrange
			var a = 0;
			var taskName = 'emit-error-task';
			var expectedErr = {message:'this is an error'};
			var task = {
				name: taskName,
				fn: function(cb) {
					cb(expectedErr);
				}
			};
			var emit = function (name, args) {
				switch(name) {
					case 'task_start':
						a++;
						break;
					case 'task_error':
						args.err.should.equal(expectedErr);
						a++;
						break;
					default:
						throw new Error('invalid event: '+name);
				}
			};

			// act
			emitTask(task, defaultTaskTimeout, emit)(function () {

				// assert
				a.should.equal(2); // it got both events

				done();
			});
		});

		it('can pass args from task_start to task_end', function(done) {

			// arrange
			var a = 0;
			var taskName = 'pass-between-emit';
			var theParameter = {a:'r',g:'s'};
			var task = {
				name: taskName,
				fn: function(cb) {
					cb(null);
				}
			};
			var emit = function (name, args) {
				switch(name) {
					case 'task_start':
						a++;
						args.theParameter = theParameter;
						break;
					case 'task_end':
						a++;
						should.exist(args.theParameter);
						args.theParameter.should.equal(theParameter);
						break;
					default:
						done('invalid event: '+name);
				}
			};

			// act
			emitTask(task, defaultTaskTimeout, emit)(function () {

				// assert
				a.should.equal(2); // it got both events

				done();
			});
		});

		it('task_end has timings', function(done) {

			// arrange
			var a = 0;
			var taskName = 'emit-timings';
			var task = {
				name: taskName,
				fn: function(cb) {
					cb(null);
				}
			};
			var emit = function (name, args) {
				switch(name) {
					case 'task_end':
						should.exist(args.duration);
						should.exist(args.hrDuration);
						should.exist(args.message);
						a++;
						break;
					//default:
						// ignore it
				}
			};

			// act
			emitTask(task, defaultTaskTimeout, emit)(function () {

				// assert
				a.should.equal(1);

				done();
			});
		});

	});
});
