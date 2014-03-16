'use strict';

// run a function, wait for it to end in various ways
function runTask(args, cb) {
	var task = args.task;

	var cb2, done, r, streamError;

	done = function (err, runMethod) {
		// get out of try/catch and ensure callback happens after Orchestrator#run() finishes
		process.nextTick(function () {
			if (err) {
				// overwrite error if any
				task.err = err;
				task.runMethod = runMethod;
			} else if (!task.runMethod) {
				// don't overwrite runMethod if timeout then finish successfully
				task.runMethod = runMethod;
			}
			cb(null);
		});
	};

	cb2 = function (err) {
		done(err, 'callback');
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

	} else if (task.fn.length !== 1) {
		// not a callback, fail
		var err = new Error(task.name+' is accidentally running synchronously. Call the callback or return a promise or stream');
		err.syncTaskFail = true;
		err.task = task;
		done(err, 'sync');

	//} else {
		// FRAGILE: ASSUME: callback

	}
}

module.exports = runTask;
