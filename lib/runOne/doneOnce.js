'use strict';

// ensure it's only "done" once
function run (args, cb) {
	var task = args.task;

	if (task.isDone && !task.err) {
		task.err = new Error(task.name+' task completion callback called too many times');
	}
	task.isDone = true;

	cb(null);
}

module.exports = {
	run: run
};
