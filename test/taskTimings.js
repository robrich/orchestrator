/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('orchestrator task timings', function() {

	describe('_runTask()', function() {
		it('should set span to 1 when task takes 1 second', function(done) {
			var orchestrator, a, fn, timeout;

			// Arrange
			timeout = 0.01; // seconds
			a = 0;
			fn = function(cb) {
				setTimeout(function () {
					cb();
				}, timeout*1000); // milliseconds
			};

			// The thing under test
			orchestrator = new Orchestrator();
			orchestrator.add('test', fn);

			orchestrator.on('task_stop', function (args) {
				// Assert
				args.span.should.be.approximately(timeout, 0.02);
				args.span.should.be.above(0);
				++a;
			});

			// Act
			orchestrator.start('test', function (err) {
				// Assert
				a.should.equal(1);
				should.not.exist(err);
				done();
			});
		});

	});
});
