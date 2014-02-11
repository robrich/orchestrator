'use strict';

// time an action
var start = function (cb, args) {
	var task = args.task;

	// mark start time
	task.start = process.hrtime();

	cb(null, args);
};

var end = function (cb, args) {
	var task = args.task;

	// grab duration
	task.duration = process.hrtime(task.start);

	cb(null, args);
};

module.exports = {
	start: start,
	end: end
};
