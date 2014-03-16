/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('lib/task/', function() {
	describe('reset()', function() {

		it('should clear all tasks', function(done) {

			// arrange
			var fn = function() {};

			// the thing under test
			var orchestrator = new Orchestrator();
			orchestrator.task('task1', fn);
			orchestrator.task('task2', fn);
			should.exist(orchestrator.tasks.task1);
			should.exist(orchestrator.tasks.task2);

			// act
			orchestrator.reset();

			// assert
			should.not.exist(orchestrator.tasks.task1);
			should.not.exist(orchestrator.tasks.task2);

			done();
		});

	});
});
