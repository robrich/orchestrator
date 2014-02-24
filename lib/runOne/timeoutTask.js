'use strict';

// timeout if it takes too long
function run (fn, args, cb) {
	var task = args.task;
	var orchestrator = args.orchestrator;
	var timedOut = false;

	// timeout if it goes too long
	var timeoutHandle = setTimeout(function () {
		if (!task.isDone) {
			if (!task.err) {
				task.runMethod = 'timeout';
				task.err = new Error('task \''+task.name+'\' timed out, waited '+orchestrator.taskTimeout+' ms');
				task.err.timeout = true;
			}
			timedOut = true;
			cb(null);
		}
	}, orchestrator.taskTimeout);

	fn(function (err) {
		if (err) {
			task.err = err;
		}

		if (timeoutHandle) {
			clearTimeout(timeoutHandle);
			timeoutHandle = null;
		}

		if (timedOut) {
			// It timed out previously and just finished
			// Don't call callback
			return;
		}

		cb(null);
	});
}

module.exports = {
	run: run
};
