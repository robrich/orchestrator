'use strict';

// ensure it's only "done" once
var run = function (cb, args) {
	var task = args.task;

	if (task.isDone && !task.err) {
		task.err = new Error(task.name+' task completion callback called too many times');
	}
	task.isDone = true;

	cb(null, args);
};

module.exports = {
	run: run
};
