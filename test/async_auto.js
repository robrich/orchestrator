/*jshint node:true */
/*global describe:false, it:false */

'use strict';

var async = require('async');
var should = require('should');
require('mocha');

describe('async', function() {
	describe('auto()', function() {
		var defaultTaskTimeout = 100;
		var defaultEmit = function () {};

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

			// act
			async.auto(tasks, function (err) {

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

			// act
			async.auto(tasks, function (err) {

				// assert
				should.exist(err);
				err.should.equal(expectedError);
				a.should.be.above(0); // it ran

				done();
			});
		});

	});
});
