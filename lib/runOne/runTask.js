'use strict';

// run a function, wait for it to end in various ways
module.exports = function (args, cb) {
	var task = args.task;

	var cb2, done, r, streamError;

	done = function (err, runMethod) {
		task.runMethod = runMethod;
		task.err = err || task.err;
		cb(null);
	};

	cb2 = function (err) {
		// get out of try/catch
		process.nextTick(function () {
			done(err, 'callback');
		});
	};

	try {
		r = task.fn.call(task, cb2);
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

	} else if (task.fn.length === 0) {
		// synchronous, function took in no parameters
		done(null, 'sync');

	//} else {
		// FRAGILE: ASSUME: callback

	}
};
