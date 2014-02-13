/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
var onAll = require('../lib/listen/onAll');
require('should');
require('mocha');

describe('orchestrator', function() {
	describe('onAll()', function() {

		it('should wire up end event', function(done) {

			// arrange
			var count = 0;
			var src = 'end';
			var fn = function (e) {
				count++;
				e.src.should.equal(src);
			};

			// the thing under test
			var orchestrator = new Orchestrator();

			// act
			orchestrator.onAll(fn);
			orchestrator.emit(src, {});

			// assert
			count.should.equal(1);

			done();
		});

		it('should wire up all events', function(done) {

			// arrange
			var count = 0;
			var src = 'error';
			var fn = function () {
				count++;
			};

			// the thing under test
			var orchestrator = new Orchestrator();

			// act
			orchestrator.onAll(fn);
			onAll.events.forEach(function (e) {
				orchestrator.emit(e, {});
			});

			// assert
			count.should.equal(onAll.events.length);
			
			done();
		});

	});
});
