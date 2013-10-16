/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('orchestrator tasks', function() {
	describe('add()', function() {

		it('should define a task', function(done) {
			var orchestrator, fn;

			// Arrange
			fn = function() {};

			// Act
			orchestrator = new Orchestrator();
			orchestrator.add('test', fn);

			// Assert
			should.exist(orchestrator.tasks.test);
			orchestrator.tasks.test.fn.should.equal(fn);
			done();
		});

	});
});
