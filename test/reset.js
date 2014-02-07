/*jshint node:true */
/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
require('should');
require('mocha');

describe('orchestrator', function() {
	describe('reset()', function() {

		it('should clear all tasks', function(done) {
			var orchestrator, name1, name2, fn;

			// Arrange
			name1 = 'task1';
			name2 = 'task2';
			fn = function() {};

			// the thing under test
			orchestrator = new Orchestrator();
			orchestrator.task(name1, fn);
			orchestrator.task(name2, fn);
			orchestrator.hasTask(name1).should.equal(true);
			orchestrator.hasTask(name2).should.equal(true);

			// Act
			orchestrator.reset();

			// Assert
			orchestrator.hasTask(name1).should.equal(false);
			orchestrator.hasTask(name2).should.equal(false);
			done();
		});

	});
});
