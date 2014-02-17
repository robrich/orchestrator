/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('lib/task/', function() {
	describe('task()', function() {

		it('should return task if there is a task', function(done) {

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
			var actual = orchestrator.task(name);

			// assert
			actual.should.equal(task1);

			done();
		});

		it('should return undefined if there is no such task', function(done) {

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
			var actual = orchestrator.task('not'+name);

			// assert
			should.not.exist(actual);

			done();
		});

		it('should create a task if passed a second arg', function(done) {

			// arrange
			var name = 'task1';
			var fn = function () {};

			// the thing under test
			var orchestrator = new Orchestrator();

			// act
			var actual = orchestrator.task(name, fn);

			// assert
			should.not.exist(actual);
			should.exist(orchestrator.tasks[name]);
			orchestrator.tasks[name].name.should.equal(name);

			done();
		});

		it('should create a task with dependencies if passed a third arg', function(done) {

			// arrange
			var name = 'task1';
			var dep = ['task2'];
			var fn = function () {};

			// the thing under test
			var orchestrator = new Orchestrator();

			// act
			var actual = orchestrator.task(name, dep, fn);

			// assert
			should.not.exist(actual);
			should.exist(orchestrator.tasks[name]);
			orchestrator.tasks[name].name.should.equal(name);
			orchestrator.tasks[name].before.should.equal(dep);

			done();
		});

		it('should throw if passed an invalid arg', function(done) {

			// arrange
			var name = 'task1';
			var dep;
			var fn = 42;
			var actual;

			// the thing under test
			var orchestrator = new Orchestrator();

			// act
			try {
				orchestrator.task(name, dep, fn);
			} catch (err) {
				actual = err;
			}

			// assert
			should.exist(actual);
			should.exist(actual.message);
			actual.message.indexOf('function').should.be.above(-1);

			done();
		});

	});
});
