/*global describe:false, it:false */

'use strict';

var args = require('../lib/runOne/args');
var should = require('should');
require('mocha');

describe('lib/runOne/', function() {
	describe('args()', function() {

		it('creates the object', function(done) {

			// arrange
			var task = {};
			var orchestrator = {};

			// act
			var actual = args(task, orchestrator);

			// assert
			should.exist(actual);

			done();
		});

		it('creates the object with both properties', function(done) {

			// arrange
			var task = {t:'ask'};
			var orchestrator = {orch:'estrator'};

			// act
			var actual = args(task, orchestrator);

			// assert
			actual.task.should.equal(task);
			actual.orchestrator.should.equal(orchestrator);

			done();
		});

	});
});
