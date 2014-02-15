'use strict';

// turn list of names into list of tasks
module.exports = function (args, cb) {
	var names = args.runTaskNames;
	var allTasks = args.orchestrator.tasks;
	var queue = {};

	// task names to tasks
	var err; // missing task? can't proceed
	names.forEach(function (name) {
		if (allTasks.hasOwnProperty(name)) {
			queue[name] = allTasks[name];
		} else {
			// FRAGILE: This matches how require('sequencify') shows missing task errors
			err = new Error('task "'+name+'" is not defined');
			err.missingTask = name;
			err.taskList = names;
		}
	});

	args.runTasks = queue;
	cb(err);
};
