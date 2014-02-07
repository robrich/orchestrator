/*jshint node:true */

'use strict';

// Run a function, waiting for it to end in various ways
module.exports = function (task, done) {
	var cb, r, streamError;

	cb = function (err) {
		// get out of try/catch
		process.nextTick(function () {
			done(err, 'callback');
		});
	};

	try {
		r = task(cb);
	} catch (err) {
		return done(err, 'catch');
	}

	if (r && typeof r.done === 'function') {
		// wait for promise to resolve
		// FRAGILE: ASSUME: Promises/A+, see http://promises-aplus.github.io/promises-spec/
		r.done(function () {
			done(null, 'promise');
		}, function(err) {
			done(err, 'promise');
		});

	} else if (r && typeof r.pipe === 'function') {
		// wait for stream to end

		r.on('error', function (err) {
			streamError = err;
		});
		r.on('data', function () {
			streamError = null; // The error wasn't fatal, move along
		});
		r.once('end', function () {
			done(streamError, 'stream');
		});

	} else if (task.length === 0) {
		// synchronous, function took in no parameters
		done(null, 'sync');

	//} else {
		// FRAGILE: ASSUME: callback

	}
};
