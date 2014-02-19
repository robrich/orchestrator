'use strict';

// time an action
function start (args, cb) {
	var task = args.task;

	// mark start time
	task.start = process.hrtime();

	cb(null);
}

function end (args, cb) {
	var task = args.task;

	// grab duration
	task.duration = process.hrtime(task.start);

	cb(null);
}

module.exports = {
	start: start,
	end: end
};
