/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('onAll()', function() {

		it('should wire up event listener', function(done) {
			var orchestrator, cb, a = 0;

			// arrange
			cb = function() {
				++a;
			};
			orchestrator = new Orchestrator();

			// act
			orchestrator.onAll(cb);
			orchestrator.emit('start', {}); // fake do action that would fire event

			// assert
			a.should.equal(1);
			done();
		});

		it('should add src to event args', function(done) {
			var orchestrator, cb, actualE;

			// arrange
			cb = function(e) {
				actualE = e;
			};
			orchestrator = new Orchestrator();

			// act
			orchestrator.onAll(cb);
			orchestrator.emit('end', {}); // fake do action that would fire event

			// assert
			should.exist(actualE);
			actualE.src.should.equal('end');
			done();
		});

	});
});
