/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
require('should');
require('mocha');

describe('lib/task/', function() {
	describe('taskNames()', function() {
		var noop = function () {};

		var addTask = function (orchestrator, name) {
			orchestrator.tasks[name] = {
				name: name,
				fn: noop
			};
		};

		it('should return two task names', function(done) {

			// arrange
			var name1 = 'task1';
			var name2 = 'task2';

			// the thing under test
			var orchestrator = new Orchestrator();
			addTask(orchestrator, name1);
			addTask(orchestrator, name2);

			// act
			var actual = orchestrator.taskNames();

			// assert
			actual.length.should.equal(2);
			actual[0].should.equal(name1);
			actual[1].should.equal(name2);

			done();
		});

		it('should return no tasks when the task queue is empty', function(done) {

			// arrange

			// the thing under test
			var orchestrator = new Orchestrator();

			// act
			var actual = orchestrator.taskNames();

			// assert
			actual.length.should.equal(0);

			done();
		});

	});
});
