'use strict';

// turn list of names into list of tasks
module.exports = function (cb, args) {
	var names = args.runTaskNames;
	var allTasks = args.orchestrator.tasks;

	// task names to tasks
	var err; // missing task? can't proceed
	var queue = names.map(function (name) {
		if (allTasks.hasOwnProperty(name)) {
			return allTasks[name];
		} else {
			err = new Error('task "'+name+'" is not defined');
			err.missingTask = name;
			err.taskList = names;
		}
	});

	args.runTasks = queue;
	cb(err, args);
};
