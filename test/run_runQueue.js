/*global describe:false, it:false */

'use strict';

var runQueue = require('../lib/run/runQueue');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('runQueue()', function() {

		var makeArgs = function (tasks) {
			return {
				runAutoTasks: tasks
			};
		};

		it('runs two tasks successfully and calls callback', function(done) {

			// arrange
			var a = 0;
			var tasks = {
				task1: [function (cb) {
					a++;
					cb(null);
				}],
				task2: [function (cb) {
					a+=10;
					cb(null);
				}]
			};
			var args = makeArgs(tasks);

			// act
			runQueue(args, function (err) {

				// assert
				should.not.exist(err); // it didn't error
				a.should.equal(11); // it ran

				done();
			});
		});

		it('runs erroring tasks and calls callback', function(done) {

			// arrange
			var a = 0;
			var expectedError = {message:'this is an error'};
			var tasks = {
				task1: [function (cb) {
					a++;
					cb(expectedError);
				}],
				task2: [function (cb) {
					a+=10;
					cb(expectedError);
				}]
			};
			var args = makeArgs(tasks);

			// act
			runQueue(args, function (err) {

				// assert
				should.exist(err);
				err.should.equal(expectedError);
				a.should.be.above(0); // it ran

				done();
			});
		});

		it('runs tasks and trims results on callback', function(done) {

			// arrange
			var a = 0;
			var tasks = {
				task1: [function (cb) {
					a++;
					cb(null, 'result1');
				}],
				task2: [function (cb) {
					a+=10;
					cb(null, 'result2');
				}]
			};
			var args = makeArgs(tasks);

			// act
			runQueue(args, function (err) {

				// assert
				should.not.exist(err); // it didn't error
				a.should.equal(11); // it ran
				arguments.length.should.equal(1); // it only passed err

				done();
			});
		});

	});
});
