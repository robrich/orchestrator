/*global describe:false, it:false */

'use strict';

var validateBuilderArgs = require('../lib/builder/validateBuilderArgs');
var should = require('should');
require('mocha');

describe('lib/builder/', function() {
	describe('validateBuilderArgs()', function() {

		// avoid using the real require('series') as that'll recurse into validateBuilderArgs
		var fakeBuilder = function (array) {
			return {
				isBuilder: true,
				series: array
			};
		};

		it('accepts an empty array', function(done) {

			// arrange
			var args = [];

			// act
			validateBuilderArgs(args);

			// assert
			// if we're still here it worked

			done();
		});

		it('accepts an array with two strings', function(done) {

			// arrange
			var args = ['one', 'two'];

			// act
			validateBuilderArgs(args);

			// assert
			// if we're still here it worked

			done();
		});

		it('accepts an array of builders', function(done) {

			// arrange
			var args = [fakeBuilder('a','b','c'), fakeBuilder('def')];

			// act
			validateBuilderArgs(args);

			// assert
			// if we're still here it worked

			done();
		});

		it('throws on an array of numbers', function(done) {

			// arrange
			var arg = 42;
			var args = [arg];
			var actualErr;

			// act
			try {
				validateBuilderArgs(args);
			} catch (err) {
				actualErr = err;
			}

			// assert
			should.exist(actualErr);
			actualErr.taskInvalid.should.equal(true);
			actualErr.arg.should.equal(arg);

			done();
		});

		it('throws on an array of arrays', function(done) {

			// arrange
			var arg = ['array'];
			var args = [arg];
			var actualErr;

			// act
			try {
				validateBuilderArgs(args);
			} catch (err) {
				actualErr = err;
			}

			// assert
			should.exist(actualErr);
			actualErr.taskInvalid.should.equal(true);
			actualErr.arg.should.equal(arg);

			done();
		});

	});
});
