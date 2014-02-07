/*jshint node:true */
/*global describe:false, it:false */

'use strict';

var runQueue = require('../lib/run/runQueue');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('runQueue()', function() {
		var defaultTaskTimeout = 100;
		var defaultEmit = function () {};

		it('runs two tasks successfully and calls callback', function(done) {

			// arrange
			var a = 0;
			var task1 = {
				name: 'task1',
				dep: [],
				fn: function (cb) {
					console.log('task1');
					a++;
					cb(null);
				}
			};
			var task2 = {
				name: 'task2',
				dep: [],
				fn: function (cb) {
					console.log('task2');
					a += 10;
					cb(null);
				}
			}
			var tasks = [task1,task2];

			// act
			runQueue(tasks, defaultTaskTimeout, defaultEmit, function (err) {

				// assert
				should.not.exist(err); // it didn't error
				a.should.equal(11); // it ran

				done();
			});
		});

		it('runs erroring tasks and calls callback', function(done) {

			// arrange
			var a = 0;
			var expectedError = {message:'this is an erroring task'};
			var task1 = {
				name: 'task1',
				dep: [],
				fn: function (cb) {
					a++;
					cb(expectedError);
				}
			};
			var task2 = {
				name: 'task2',
				dep: [],
				fn: function (cb) {
					a += 10;
					cb(expectedError);
				}
			}
			var tasks = [task1,task2];

			// act
			runQueue(tasks, defaultTaskTimeout, defaultEmit, function (err) {

				// assert
				should.exist(err);
				err.should.equal(expectedError);
				a.should.equal(11); // it ran

				done();
			});
		});

	});
});
