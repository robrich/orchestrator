/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
require('should');
require('mocha');

describe('lib/task/', function() {
	describe('reset()', function() {

		it('should clear all tasks', function(done) {

			// arrange
			var name1 = 'task1';
			var name2 = 'task2';
			var fn = function() {};

			// the thing under test
			var orchestrator = new Orchestrator();
			orchestrator.task(name1, fn);
			orchestrator.task(name2, fn);
			orchestrator.hasTask(name1).should.equal(true);
			orchestrator.hasTask(name2).should.equal(true);

			// act
			orchestrator.reset();

			// assert
			orchestrator.hasTask(name1).should.equal(false);
			orchestrator.hasTask(name2).should.equal(false);

			done();
		});

	});
});
