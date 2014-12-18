/*jshint node:true */

"use strict";

var eos = require('end-of-stream');
var consume = require('stream-consume');

module.exports = function (task, done, input) {
	var that = this, finish, cb, isDone = false, start, r;

	finish = function (err, runMethod, output) {
		var hrDuration = process.hrtime(start);

		if (isDone && !err) {
			err = new Error('task completion callback called too many times');
		}
		isDone = true;

		var duration = hrDuration[0] + (hrDuration[1] / 1e9); // seconds

		done.call(that, err, {
			duration: duration, // seconds
			hrDuration: hrDuration, // [seconds,nanoseconds]
			runMethod: runMethod
		}, output);
	};

	cb = function (err, output) {
		finish(err, 'callback', output);
	};

	try {
		start = process.hrtime();
		r = task(cb, input);
	} catch (err) {
		return finish(err, 'catch');
	}

	if (r && typeof r.then === 'function') {
		// wait for promise to resolve
		// FRAGILE: ASSUME: Promises/A+, see http://promises-aplus.github.io/promises-spec/
		r.then(function (res) {
			finish(null, 'promise', res);
		}, function(err) {
			finish(err, 'promise');
		});

	} else if (r && typeof r.pipe === 'function') {
		// wait for stream to end

		eos(r, { error: true, readable: r.readable, writable: r.writable && !r.readable }, function(err){
			finish(err, 'stream');
		});

		// Ensure that the stream completes
        consume(r);

	} else if (task.length === 0) {
		// synchronous, function took in args.length parameters, and the callback was extra
		finish(null, 'sync', r);

	//} else {
		// FRAGILE: ASSUME: callback

	}
};
