/*global describe:false, it:false */

'use strict';

var parallel = require('../lib/builder/parallel');
var should = require('should');
require('mocha');

describe('lib/builder/', function() {
	describe('parallel()', function() {

		it('accepts zero args', function(done) {

			// arrange

			// act
			var builder = parallel();

			// assert
			builder.isBuilder.should.equal(true);
			builder.parallel.length.should.equal(0);

			done();
		});

		it('accepts string args', function(done) {

			// arrange

			// act
			var builder = parallel('one','two','three');

			// assert
			builder.isBuilder.should.equal(true);
			builder.parallel.length.should.equal(3);
			builder.parallel[0].should.equal('one');
			builder.parallel[1].should.equal('two');
			builder.parallel[2].should.equal('three');

			done();
		});

		it('accepts nested builders', function(done) {

			// arrange
			var inner = parallel('456');

			// act
			var builder = parallel('one','two', inner);

			// assert
			builder.isBuilder.should.equal(true);
			builder.parallel.length.should.equal(3);
			builder.parallel[0].should.equal('one');
			builder.parallel[1].should.equal('two');
			builder.parallel[2].should.equal(inner);

			done();
		});

		it('errors on content is a number', function(done) {

			// arrange
			var val = 42;
			var actualErr;

			// act
			try {
				parallel(val);
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
				parallel(val);
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
