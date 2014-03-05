/*global describe:false, it:false */

'use strict';

var series = require('../lib/builder/series');
var should = require('should');
require('mocha');

describe('lib/builder/', function() {
	describe('series()', function() {

		it('accepts zero args', function(done) {

			// arrange

			// act
			var builder = series();

			// assert
			builder.isBuilder.should.equal(true);
			builder.series.length.should.equal(0);

			done();
		});

		it('accepts string args', function(done) {

			// arrange

			// act
			var builder = series('one','two','three');

			// assert
			builder.isBuilder.should.equal(true);
			builder.series.length.should.equal(3);
			builder.series[0].should.equal('one');
			builder.series[1].should.equal('two');
			builder.series[2].should.equal('three');

			done();
		});

		it('accepts nested builders', function(done) {

			// arrange
			var inner = series('456');

			// act
			var builder = series('one','two', inner);

				// assert
			builder.isBuilder.should.equal(true);
			builder.series.length.should.equal(3);
			builder.series[0].should.equal('one');
			builder.series[1].should.equal('two');
			builder.series[2].should.equal(inner);

			done();
		});

		it('errors on content is a number', function(done) {

			// arrange
			var val = 42;
			var actualErr;

			// act
			try {
				series(val);
			} catch (err) {
				actualErr = err;
			}

			// assert
			should.exist(actualErr);
			actualErr.taskInvalid.should.equal(true);
			actualErr.arg.should.equal(val);

			done();
		});

		it('errors on builder content is an array', function(done) {

			// arrange
			var val = ['an-array'];
			var actualErr;

			// act
			try {
				series(val);
			} catch (err) {
				actualErr = err;
			}

			// assert
			should.exist(actualErr);
			actualErr.taskInvalid.should.equal(true);
			actualErr.arg.should.equal(val);

			done();
		});

	});
});
