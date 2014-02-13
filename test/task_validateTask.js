/*global describe:false, it:false */

'use strict';

var validateTask = require('../lib/task/validateTask');
var should = require('should');
require('mocha');

describe('lib/task/', function() {
	describe('validateTask()', function() {

		it('should return nothing on valid task', function(done) {

			// arrange
			var name = 'task1';
			var dep = [];
			var fn = function () {};

			// act
			validateTask(name, dep, fn);

			// assert
			// if it didn't throw, it worked
			done();
		});

		it('should throw if passed a null name', function(done) {

			// arrange
			var name; // stays undefined
			var dep = [];
			var fn = function () {};
			var actual;

			// act
			try {
				validateTask(name, dep, fn);
			} catch (err) {
				actual = err;
			}

			// assert
			should.exist(actual);
			true.should.equal(actual.invalidTask);
			should.exist(actual.message);
			actual.message.indexOf('name').should.be.above(-1);
			actual.invalid.should.equal('name');
			done();
		});

		it('should throw if passed an invalid dep', function(done) {

			// arrange
			var name = 'task1';
			var dep = 42;
			var fn = function () {};
			var actual;

			// act
			try {
				validateTask(name, dep, fn);
			} catch (err) {
				actual = err;
			}

			// assert
			should.exist(actual);
			true.should.equal(actual.invalidTask);
			should.exist(actual.message);
			actual.message.indexOf('dependenc').should.be.above(-1);
			actual.invalid.should.equal('dependencies');
			done();
		});

		it('should throw if passed an invalid fn', function(done) {

			// arrange
			var name = 'task1';
			var dep = [];
			var fn = 42;
			var actual;

			// act
			try {
				validateTask(name, dep, fn);
			} catch (err) {
				actual = err;
			}

			// assert
			should.exist(actual);
			true.should.equal(actual.invalidTask);
			should.exist(actual.message);
			actual.message.indexOf('function').should.be.above(-1);
			actual.invalid.should.equal('function');
			done();
		});

	});
});
