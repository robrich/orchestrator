/*jshint node:true */

'use strict';

// Time a function's execution time, timeout if it takes too long, and ensure it's only "done" once
module.exports = function (task, taskName, taskTimeout, done) {
	var finish, isDone = false, start, timeoutHandle, timedOut = false;

	finish = function (err, runMethod) {
		var hrDuration = process.hrtime(start);

		if (timeoutHandle) {
			clearTimeout(timeoutHandle);
			timeoutHandle = null;
		} else if (!err && timedOut) {
			return; // it timed out previously, and just now finished successfully
		}

		if (isDone && !err) {
			err = new Error(taskName+' task completion callback called too many times');
		}
		isDone = true;

		var duration = hrDuration[0] + (hrDuration[1] / 1e9); // seconds

		done(err, {
			duration: duration, // seconds
			hrDuration: hrDuration, // [seconds,nanoseconds]
			runMethod: runMethod
		});
	};

	timeoutHandle = setTimeout(function () {
		if (!isDone) {
			finish(new Error('task \''+taskName+'\' timed out, waited '+taskTimeout+' ms'), 'timeout');
			timedOut = true;
		}
	}, taskTimeout);
	
	start = process.hrtime();
	task(finish);
};
