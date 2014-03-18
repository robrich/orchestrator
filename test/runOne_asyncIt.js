/*global describe:false, it:false */

'use strict';

var asyncIt = require('../lib/runOne/asyncIt');
var makeArgs = require('../lib/runOne/args');
var should = require('should');
require('mocha');

describe('lib/runOne/', function() {
	describe('asyncIt()', function() {
		var fakeOrchestrator = {};

		it('runs task successfully', function(done) {

			// arrange
			var task = {};
			var runOptions = {};
			var args = makeArgs(task, runOptions, fakeOrchestrator);

			// act
			asyncIt.run(args, function (err) {

				// assert
				should.not.exist(err);

				done();
			});
		});

		it('runs asynchronously', function(done) {

			// arrange
			var a = 0;
			var task = {};
			var runOptions = {};
			var args = makeArgs(task, runOptions, fakeOrchestrator);

			// act
			asyncIt.run(args, function (/*err*/) {

				// assert
				a.should.equal(1);

				done();
			});
			a++;
		});

	});
});
