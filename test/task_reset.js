/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
var should = require('should');
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
			should.exist(orchestrator.tasks.name1);
			should.exist(orchestrator.tasks.name2);

			// act
			orchestrator.reset();

			// assert
			should.not.exist(orchestrator.tasks.name1);
			should.not.exist(orchestrator.tasks.name2);

			done();
		});

	});
});
