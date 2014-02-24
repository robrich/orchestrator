'use strict';

// get doneCallback arguments
function doneArgs (err, args, cb) {
	var tasks = args.runTaskNames;

	// tell them what happened
	args.doneArgs = {
		tasks: tasks,
		duration: args.duration
	};
	if (err) {
		args.doneArgs.err = err;
		args.doneArgs.message = 'failed '+tasks.join(', ');
	} else {
		args.doneArgs.message = 'succeeded '+tasks.join(', ');
	}

	cb(null);
}

module.exports = doneArgs;
