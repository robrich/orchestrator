/*jshint node:true */
/*global describe:false, it:false */

'use strict';

var runOne = require('../lib/runOne');
var should = require('should');
require('mocha');

describe('lib/runOne/', function() {
	describe('index()', function() {
		var defaultTaskTimeout = 100;
		var defaultEmit = function () {};

		it('doesn\'t change task dep array', function(done) {

			// arrange
			var a = 0;
			var taskName = 'good-task';
			var depLength = 1;
			var dep = ['dep'];
			dep.length.should.equal(depLength);
			var task = {
				name: taskName,
				dep: dep,
				fn: function(cb) {
					a++;
					cb(null);
				}
			};

			// act
			var actual = runOne(task, defaultTaskTimeout, defaultEmit);

			// assert
			should.exist(actual);
			actual.length.should.equal(depLength+1);
			dep.length.should.equal(depLength);

			done();
		});

		it('last arg is a function', function(done) {

			// arrange
			var a = 0;
			var taskName = 'good-task';
			var depLength = 1;
			var dep = ['dep'];
			dep.length.should.equal(depLength);
			var task = {
				name: taskName,
				dep: dep,
				fn: function(cb) {
					a++;
					cb(null);
				}
			};

			// act
			var actual = runOne(task, defaultTaskTimeout, defaultEmit);

			// assert
			should.exist(actual);
			actual.length.should.equal(depLength+1);
			(typeof actual[depLength]).should.equal('function');

			done();
		});

		// TODO: how to validate emitTask.bind() works as expected?

	});
});
