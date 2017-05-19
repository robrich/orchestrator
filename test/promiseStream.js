/*jshint node:true */
/*global describe:false, it:false */
"use strict";

var Orchestrator = require("../");
var Q = require("q");
var Stream = require("stream");
var should = require("should");
require("mocha");

describe("orchestrator", function() {
	describe("when given a promise that resolves into a stream", function() {
		it("should wait for the stream", function(done) {
			var orchestrator;
			var streamClosed = false;

			// Arrange
			orchestrator = new Orchestrator();
			orchestrator.add("test", function() {
				return Q().then(function() {
					var stream = new Stream();

					// setTimeout is required here, because for this test to work
					// this has to take longer than the nextTick used in the start
					// callback
					setTimeout(function() {
						stream.emit("end");
						streamClosed = true;
					}, 0);


					return stream;
				});
			});

			// Act
			orchestrator.start("test", function(err) {
				// process.nextTick is used because all errors in the
				// start callback are swallowed by Q
				process.nextTick(function () {
					
					// Assert
					streamClosed.should.equal(true);
					should.not.exist(err);
					done();
				});
			});
		});
	});
});
