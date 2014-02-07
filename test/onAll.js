/*jshint node:true */
/*global describe:false, it:false */

'use strict';

var Orchestrator = require('../');
var onAll = require('../lib/listen/onAll');
require('should');
require('mocha');

describe('orchestrator', function() {
	describe('onAll()', function() {

		it('should wire up end event', function(done) {
			var orchestrator, src, fn, count = 0;

			// Arrange
			src = 'end';
			fn = function (e) {
				count++;
				e.src.should.equal(src);
			};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			orchestrator.onAll(fn);
			orchestrator.emit(src, {});

			// Assert
			count.should.equal(1);
			done();
		});

		it('should wire up all events', function(done) {
			var orchestrator, src, fn, count = 0;

			// Arrange
			src = 'error';
			fn = function () {
				count++;
			};

			// the thing under test
			orchestrator = new Orchestrator();

			// Act
			orchestrator.onAll(fn);
			onAll.events.forEach(function (e) {
				orchestrator.emit(e, {});
			});

			// Assert
			count.should.equal(onAll.events.length);
			done();
		});

	});
});
