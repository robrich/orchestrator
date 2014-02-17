/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('task() #2', function() {

		it('should define a task', function(done) {
			var orchestrator, fn;

			// arrange
			fn = function() {};

			// act
			orchestrator = new Orchestrator();
			orchestrator.task('test', fn);

			// assert
			should.exist(orchestrator.tasks.test);
			orchestrator.tasks.test.fn.should.equal(fn);
			done();
		});

		var failTest = function (one, two, three) {
			var orchestrator, actualErr;

			// arrange
			orchestrator = new Orchestrator();

			// act
			try {
				orchestrator.task(one, two, three);
			} catch (err) {
				actualErr = err;
			}

			// assert
			should.exist(actualErr);
			actualErr.message.indexOf('Task').should.be.above(-1);
		};

		it('should error if name is not a string', function (done) {
			var name, fn;

			// arrange
			name = 9; // not a string
			fn = function () {};

			// act & Assert
			failTest(name, fn);
			done();
		});

		it('should error if dep is not an array', function (done) {
			var name, dep, fn;

			// arrange
			name = 'name';
			dep = 9; // not an array and not an object
			fn = function () {};

			// act & Assert
			failTest(name, dep, fn);
			done();
		});

		it('should error if dep contains a non-string', function (done) {
			var name, dep, fn;

			// arrange
			name = 'name';
			dep = [9]; // not an array and not an object
			fn = function () {};

			// act & Assert
			failTest(name, dep, fn);
			done();
		});

		it('should error if fn is not a function', function (done) {
			var name, fn;

			// arrange
			name = 'name';
			fn = 9; // not a function

			// act & Assert
			failTest(name, fn);
			done();
		});

		it('should error if fn is not a function and there are dependencies', function (done) {
			var name, dep, fn;

			// arrange
			name = 'name';
			dep = ['name'];
			fn = 9; // not a function

			// act & Assert
			failTest(name, dep, fn);
			done();
		});

		it('should accept dependencies with no function', function (done) {
			var orchestrator, name, dep;

			// arrange
			name = 'name';
			dep = ['name'];

			// act
			orchestrator = new Orchestrator();
			orchestrator.task(name, dep);

			// assert
			should.exist(orchestrator.tasks.name);
			orchestrator.tasks.name.before.should.equal(dep);
			done();
		});

	});
});
