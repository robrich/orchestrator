'use strict';

// timeout if it takes too long
var run = function (fn, cb, args) {
	var task = args.task;
	var orchestrator = args.orchestrator;
	var done = false;

	// timeout if it goes too long
	var timeoutHandle = setTimeout(function () {
		if (!task.isDone) {
			task.runMethod = 'timeout';
			task.err = new Error('task \''+task.name+'\' timed out, waited '+orchestrator.taskTimeout+' ms');
			done = true;
			cb(null, args);
		}
	}, orchestrator.taskTimeout);

	fn(function (err/*, args*/) {
		if (err) {
			return cb(err, args);
		}

		if (timeoutHandle) {
			clearTimeout(timeoutHandle);
			timeoutHandle = null;
		} else if (!task.err && done) {
			return; // it timed out previously, and just now finished successfully
		}
		done = true;

		cb(null, args);
	});
};

module.exports = {
	run: run
};
