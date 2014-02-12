'use strict';

// timeout if it takes too long
var run = function (fn, cb, args) {
	var task = args.task;
	var orchestrator = args.orchestrator;
	var timedOut = false;

	// timeout if it goes too long
	var timeoutHandle = setTimeout(function () {
		if (!task.isDone) {
			if (!task.err) {
				task.runMethod = 'timeout';
				task.err = new Error('task \''+task.name+'\' timed out, waited '+orchestrator.taskTimeout+' ms');
			}
			timedOut = true;
			cb(null, args);
		}
	}, orchestrator.taskTimeout);

	fn(function (err/*, args*/) {
		if (err) {
			task.err = err;
		}

		if (timeoutHandle) {
			clearTimeout(timeoutHandle);
			timeoutHandle = null;
		}

		cb(null, args);
	});
};

module.exports = {
	run: run
};
