/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
require('should');
require('mocha');

describe('EventEmitter2', function() {
	describe('onAny()', function() {

		it('should wire up end event', function(done) {

			// arrange
			var count = 0;
			var src = 'end';
			var fn = function () {
				count++;
			};

			// the thing under test
			var orchestrator = new Orchestrator();

			// act
			orchestrator.onAny(fn);
			orchestrator.emit(src, {});

			// assert
			count.should.equal(1);

			done();
		});

		it('should wire up all events', function(done) {

			// arrange
			var count = 0;
			var events = ['start','stop','error'];
			var fn = function () {
				count++;
			};

			// the thing under test
			var orchestrator = new Orchestrator();

			// act
			orchestrator.onAny(fn);
			events.forEach(function (e) {
				orchestrator.emit(e, {});
			});

			// assert
			count.should.equal(events.length);
			
			done();
		});

	});
});
