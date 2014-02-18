'use strict';

// get doneCallback arguments
module.exports = function (err, args, cb) {
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
};
