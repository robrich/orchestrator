/*global describe:false, it:false */

'use strict';

var async = require('async');
var should = require('should');
require('mocha');

describe('async', function() {
	describe('auto()', function() {

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

		it('suppresses callback called twice', function(done) {

			// arrange
			var a = 0;
			var tasks = {
				task1: [function (cb) {
					a++;
					cb(null);
					cb(null);
				}]
			};

			// act
			async.auto(tasks, function (err) {

				// assert
				should.not.exist(err);
				a.should.equal(1); // it ran

				done();
			});
		});

		it('doesn\'t suppress erroring callback called twice', function(done) {

			// arrange
			var a = 0;
			var expectedErr = 'not null';
			var tasks = {
				task1: [function (cb) {
					a++;
					cb(null);
					cb(expectedErr);
				}]
			};

			// act
			async.auto(tasks, function (err) {

				// assert
				should.exist(err);
				err.should.equal(expectedErr);
				a.should.equal(1);

				done();
			});
		});

		/* short answer: it doesn't handle it
		it('recursive dependencies', function(done) {

			// arrange
			var a = 0;
			var tasks = {
				task1: ['task2', function (cb) {
					a++;
					cb(null);
				}],
				task2: ['task1', function (cb) {
					a++;
					cb(null);
				}]
			};

			// act
			async.auto(tasks, function (err) {

				// assert
				should.exist(err);
				a.should.equal(0);

				done();
			});
		});
		*/

		/* short answer: it doesn't
		it('missing dependencies', function(done) {

			// arrange
			var a = 0;
			var tasks = {
				task1: ['task2', function (cb) {
					a++;
					cb(null);
				}]
			};

			// act
			async.auto(tasks, function (err) {

				// assert
				should.exist(err);
				a.should.equal(0);

				done();
			});
		});
		*/

	});
});
