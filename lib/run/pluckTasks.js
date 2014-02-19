'use strict';

// turn list of names into list of tasks
function pluckTasks (args, cb) {
	var names = args.runTaskNames;
	var allTasks = args.orchestrator.tasks;
	var missing = [];
	var queue = {};

	// task names to tasks
	names.forEach(function (name) {
		if (allTasks.hasOwnProperty(name) && allTasks[name]) {
			queue[name] = allTasks[name];
		} else {
			missing.push(name);
		}
	});

	if (missing.length) {
		var err = new Error('tasks not defined: '+missing.join(', '));
		err.missingTasks = missing;
		return cb(err);
	}

	args.runTasks = queue;
	cb(null);
}

module.exports = pluckTasks;
