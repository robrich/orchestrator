/*jshint node:true */
/*global describe:false, it:false */
"use strict";

var Orchestrator = require('../');
var Stream = require('stream');
var Readable = Stream.Readable;
var Writable = Stream.Writable;
var Duplex = Stream.Duplex;
var Q = require('q');
var fs = require('fs');
var should = require('should');
require('mocha');

describe('orchestrator', function() {
	describe('when given a stream', function() {

		it('should consume a Readable stream to relieve backpressure, in objectMode', function(done) {
			var orchestrator, a;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			orchestrator.add('test', function() {
				// Create a Readable stream with a small buffer...
				var rs = Readable({objectMode: true, highWaterMark: 2});
				rs._read = function() {
					// ...and generate more chunks than fit in that buffer
					if (a++ < 100) {
						rs.push(a);
					} else {
						rs.push(null);
					}
				};
				return rs;
			});

			// Act
			orchestrator.start('test', function(err) {
				// Assert
				// Simple completion of the task is the main criterion here, but check a few things:
				a.should.be.above(99);
				should.not.exist(err);
				orchestrator.isRunning.should.equal(false);
				done();
			});
		});

		it('should consume a Readable stream to relieve backpressure', function(done) {
			var orchestrator, a;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			orchestrator.add('test', function() {
				// Create a Readable stream with a small buffer...
				var rs = Readable({highWaterMark: 2});
				rs._read = function() {
					// ...and generate more chunks than fit in that buffer
					if (a++ < 100) {
						rs.push(".");
					} else {
						rs.push(null);
					}
				};
				return rs;
			});

			// Act
			orchestrator.start('test', function(err) {
				// Assert
				// Simple completion of the task is the main criterion here, but check a few things:
				a.should.be.above(99);
				should.not.exist(err);
				orchestrator.isRunning.should.equal(false);
				done();
			});
		});

		it('should detect completion of a Writable stream', function(done) {
			var orchestrator, a, lengthRead;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			lengthRead = 0;
			orchestrator.add('test', function() {
				// Create a Readable stream...
				var rs = Readable({highWaterMark: 2});
				rs._read = function() {
					if (a++ < 100) {
						rs.push(".");
					} else {
						rs.push(null);
					}
				};

				// ...and consume it
				var ws = Writable();
				ws._write = function(chunk, enc, next) {
					lengthRead += chunk.length;
					next();
				};
				rs.pipe(ws);

				// Return the Writable
				return ws;
			});

			// Act
			orchestrator.start('test', function(err) {
				// Assert
				a.should.be.above(99);
				lengthRead.should.equal(100);
				should.not.exist(err);
				orchestrator.isRunning.should.equal(false);
				done();
			});
		});

		it('should detect completion of a Writable stream, in objectMode', function(done) {
			var orchestrator, a, lengthRead;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			lengthRead = 0;
			orchestrator.add('test', function() {
				// Create a Readable stream...
				var rs = Readable({objectMode: true, highWaterMark: 2});
				rs._read = function() {
					if (a++ < 100) {
						rs.push(a);
					} else {
						rs.push(null);
					}
				};

				// ...and consume it
				var ws = Writable({objectMode: true});
				ws._write = function(chunk, enc, next) {
					lengthRead++;
					next();
				};
				rs.pipe(ws);

				// Return the Writable
				return ws;
			});

			// Act
			orchestrator.start('test', function(err) {
				// Assert
				a.should.be.above(99);
				lengthRead.should.equal(100);
				should.not.exist(err);
				orchestrator.isRunning.should.equal(false);
				done();
			});
		});

		it('should handle an intermediate Readable stream being returned', function(done) {
			var orchestrator, a, lengthRead;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			lengthRead = 0;
			orchestrator.add('test', function() {
				// Create a Readable stream...
				var rs = Readable({highWaterMark: 2});
				rs._read = function() {
					if (a++ < 100) {
						rs.push(".");
					} else {
						rs.push(null);
					}
				};

				// ...and consume it
				var ws = Writable();
				ws._write = function(chunk, enc, next) {
					lengthRead += chunk.length;
					next();
				};
				rs.pipe(ws);

				// Return the Readable
				return rs;
			});

			// Act
			orchestrator.start('test', function(err) {
				// Assert
				a.should.be.above(99);
				// Ensure all data was received by the Writable
				lengthRead.should.equal(100);
				should.not.exist(err);
				orchestrator.isRunning.should.equal(false);
				done();
			});
		});

		it('should handle an intermediate Readable stream being returned, in objectMode', function(done) {
			var orchestrator, a, lengthRead;

			// Arrange
			orchestrator = new Orchestrator();
			a = 0;
			lengthRead = 0;
			orchestrator.add('test', function() {
				// Create a Readable stream...
				var rs = Readable({objectMode: true, highWaterMark: 2});
				rs._read = function() {
					if (a++ < 100) {
						rs.push(a);
					} else {
						rs.push(null);
					}
				};

				// ...and consume it
				var ws = Writable({objectMode: true});
				ws._write = function(chunk, enc, next) {
					lengthRead++;
					next();
				};
				rs.pipe(ws);

				// Return the Readable
				return rs;
			});

			// Act
			orchestrator.start('test', function(err) {
				// Assert
				a.should.be.above(99);
				// Ensure all data was received by the Writable
				lengthRead.should.equal(100);
				should.not.exist(err);
				orchestrator.isRunning.should.equal(false);
				done();
			});
		});

		it('should require the Readable side of a Duplex stream to be closed to trigger completion', function(done) {
			var orchestrator;
			var readableClosed = false;
			var readCalled = false;
			var writableClosed = false;

			// Arrange
			orchestrator = new Orchestrator();

			orchestrator.add('test', function() {
				var ds = Duplex();
				ds._write = function(chunk, enc, next) {
					next();
				};

				function closeReadable() {
					// Delay closing the Readable side
					setTimeout(function() {
						readableClosed = true;
						ds.push(null);
					}, 1);
				}

				ds.on("finish", function() {
					writableClosed = true;
					if (readCalled)
						closeReadable();
				});


				ds._read = function() {
					readCalled = true;
					// Only close the Readable if the Writable has already been closed
					if (writableClosed)
						closeReadable();
				}

				// Close the Writable side - after returning the stream, so that orchestrator sees the close
				setTimeout(function() {
					ds.end();
				}, 1);

				// Return the Duplex
				return ds;
			});

			// Act
			orchestrator.start('test', function(err) {
				// Assert
				readableClosed.should.be.true;
				should.not.exist(err);
				orchestrator.isRunning.should.equal(false);
				done();
			});
		});

		it('should handle a classic stream that is not piped anywhere', function(done) {
			var orchestrator;
			var readableClosed = false;
			var readCalled = false;
			var writableClosed = false;
			var i;

			// Arrange
			orchestrator = new Orchestrator();

			orchestrator.add('test', function() {
				var rs = new Stream();

				process.nextTick(function() {
					for (i = 1; i <= 100; i++) {
						rs.emit("data", i);
					}
					rs.emit("end");
				});

				// Return the Readable
				return rs;
			});

			// Act
			orchestrator.start('test', function(err) {
				// Assert
				should.not.exist(err);
				orchestrator.isRunning.should.equal(false);
				done();
			});
		});

		it('should handle a classic stream that is piped somewhere', function(done) {
			var orchestrator;
			var readableClosed = false;
			var readCalled = false;
			var writableClosed = false;
			var lengthRead = 0;
			var i;

			// Arrange
			orchestrator = new Orchestrator();

			orchestrator.add('test', function() {
				var rs = new Stream();

				process.nextTick(function() {
					for (i = 0; i < 100; i++) {
						rs.emit("data", i);
					}
					rs.emit("end");
				});

				var ws = new Writable({objectMode: true, highWaterMark: 5});
				ws._write = function(chunk, enc, next) {
					lengthRead++;
					next();
				};

				rs.pipe(ws);

				// Return the Readable
				return rs;
			});

			// Act
			orchestrator.start('test', function(err) {
				// Assert
				should.not.exist(err);
				lengthRead.should.equal(100);
				orchestrator.isRunning.should.equal(false);
				done();
			});
		});

	});
});
