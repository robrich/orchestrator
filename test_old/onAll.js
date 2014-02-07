/*jshint node:true */
/*global describe:false, it:false */

"use strict";

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('onAll()', function() {

		it('should wire up event listener', function(done) {
			var orchestrator, cb, a = 0;

			// Arrange
			cb = function() {
				++a;
			};
			orchestrator = new Orchestrator();

			// Act
			orchestrator.onAll(cb);
			orchestrator.emit('start', {}); // fake do action that would fire event

			// Assert
			a.should.equal(1);
			done();
		});

		it('should add src to event args', function(done) {
			var orchestrator, cb, actualE;

			// Arrange
			cb = function(e) {
				actualE = e;
			};
			orchestrator = new Orchestrator();

			// Act
			orchestrator.onAll(cb);
			orchestrator.emit('stop', {}); // fake do action that would fire event

			// Assert
			should.exist(actualE);
			actualE.src.should.equal('stop');
			done();
		});

	});
});
