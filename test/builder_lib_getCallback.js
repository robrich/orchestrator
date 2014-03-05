/*global describe:false, it:false */

'use strict';

var getCallback = require('../lib/builder/lib/getCallback');
var should = require('should');
require('mocha');

describe('lib/builder/lib/', function() {
	describe('getCallback()', function() {

		it('accepts an empty array', function(done) {

			// arrange
			var args = [];

			// act
			var cb = getCallback(args);

			// assert
			should.not.exist(cb);
			args.length.should.equal(0);

			done();
		});

		it('gets callback off end if it\'s a function', function(done) {

			// arrange
			var expected = function () {};
			var args = ['irrelevant', expected];

			// act
			var cb = getCallback(args);

			// assert
			cb.should.equal(expected);
			args.length.should.equal(1);

			done();
		});

		it('doesn\'t touch array if last arg isn\'t a function', function(done) {

			// arrange
			var args = ['irrelevant', 'not-a-function'];

			// act
			var cb = getCallback(args);

			// assert
			should.not.exist(cb);
			args.length.should.equal(2);

			done();
		});

	});
});
