/*global describe:false, it:false */

'use strict';

var resolveBuilderDependencies = require('../lib/run/resolveBuilderDependencies');
var should = require('should');
require('mocha');

describe('lib/run/', function() {
	describe('resolveBuilderDependencies()', function() {

		it('runs task successfully', function(done) {
			false.should.equal('write this');
			done();
		});

	});
});
