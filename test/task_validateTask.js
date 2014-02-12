/*global describe:false, it:false */

'use strict';

var validateTask = require('../lib/task/validateTask');
var should = require('should');
require('mocha');

describe('lib/task/', function() {
	describe('validateTask()', function() {

		it('should return nothing on valid task', function(done) {
			var name, dep, fn;

			// Arrange
			name = 'task1';
			dep = [];
			fn = function () {};

			// Act
			validateTask(name, dep, fn);

			// Assert
			// if it didn't throw, it worked
			done();
		});

		it('should throw if passed a null name', function(done) {
			var name, dep, fn, actual;

			// Arrange
			//name stays undefined
			dep = [];
			fn = function () {};

			// Act
			try {
				validateTask(name, dep, fn);
			} catch (err) {
				actual = err;
			}

			// Assert
			should.exist(actual);
			should.exist(actual.message);
			actual.message.indexOf('name').should.be.above(-1);
			done();
		});

		it('should throw if passed an invalid dep', function(done) {
			var name, dep, fn, actual;

			// Arrange
			name = 'task1';
			dep = 42;
			fn = function () {};

			// Act
			try {
				validateTask(name, dep, fn);
			} catch (err) {
				actual = err;
			}

			// Assert
			should.exist(actual);
			should.exist(actual.message);
			actual.message.indexOf('dependenc').should.be.above(-1);
			done();
		});

		it('should throw if passed an invalid fn', function(done) {
			var name, dep, fn, actual;

			// Arrange
			name = 'task1';
			dep = [];
			fn = 42;

			// Act
			try {
				validateTask(name, dep, fn);
			} catch (err) {
				actual = err;
			}

			// Assert
			should.exist(actual);
			should.exist(actual.message);
			actual.message.indexOf('function').should.be.above(-1);
			done();
		});

	});
});
