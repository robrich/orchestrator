/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
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

		var failTest = function (one, two, three) {
			var orchestrator, actualErr;

			// Arrange
			orchestrator = new Orchestrator();

			// Act
			try {
				orchestrator.add(one, two, three);
			} catch (err) {
				actualErr = err;
			}

			// Assert
			should.exist(actualErr);
			should.ok(actualErr.message.indexOf('Task') > -1);
		};

		it('should error if name is not a string', function (done) {
			var name, fn;

			// Arrange
			name = 9; // not a string
			fn = function () {};

			// Act & Assert
			failTest(name, fn);
			done();
		});

		it('should error if dep is not an array', function (done) {
			var name, dep, fn;

			// Arrange
			name = "name";
			dep = 9; // not an array
			fn = function () {};

			// Act & Assert
			failTest(name, dep, fn);
			done();
		});

		it('should error if dep contains a non-string', function (done) {
			var name, dep, fn;

			// Arrange
			name = "name";
			dep = 9; // not an array
			fn = function () {};

			// Act & Assert
			failTest(name, dep, fn);
			done();
		});

		it('should error if fn is not a function', function (done) {
			var name, fn;

			// Arrange
			name = "name";
			fn = 9; // not a function

			// Act & Assert
			failTest(name, fn);
			done();
		});

		it('should error if fn is not a function and there are dependencies', function (done) {
			var name, dep, fn;

			// Arrange
			name = "name";
			dep = ['name'];
			fn = 9; // not a function

			// Act & Assert
			failTest(name, dep, fn);
			done();
		});

		it('should accept dependencies with no function', function (done) {
			var orchestrator, name, dep;

			// Arrange
			name = "name";
			dep = ['name'];

			// Act
			orchestrator = new Orchestrator();
			orchestrator.add(name, dep);

			// Assert
			should.exist(orchestrator.tasks.name);
			orchestrator.tasks.name.dep.should.equal(dep);
			done();
		});

	});
});
