'use strict';

// turn list of names into list of tasks
module.exports = function (args, cb) {
	var names = args.runTaskNames;
	var allTasks = args.orchestrator.tasks;

	// task names to tasks
	var err; // missing task? can't proceed
	var queue = names.map(function (name) {
		if (allTasks.hasOwnProperty(name)) {
			return allTasks[name];
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
