/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
require('should');
require('mocha');

describe('lib/task/', function() {
	describe('hasTask()', function() {

		it('should return true if there is a task', function(done) {

			// arrange
			var name = 'task1';
			var task1 = {
				name: name,
				fn: function() {}
			};

			// the thing under test
			var orchestrator = new Orchestrator();
			orchestrator.tasks[name] = task1;

			// act
			var actual = orchestrator.hasTask(name);

			// assert
			actual.should.equal(true);

			done();
		});

		it('should return false if there is no such task', function(done) {

			// arrange
			var name = 'task1';
			var task1 = {
				name: name,
				fn: function() {}
			};

			// the thing under test
			var orchestrator = new Orchestrator();
			orchestrator.tasks[name] = task1;

			// act
			var actual = orchestrator.hasTask('not'+name);

			// assert
			actual.should.equal(false);
			
			done();
		});

	});
});
