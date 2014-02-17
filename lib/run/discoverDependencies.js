'use strict';

// gets names of all before and after dependencies, doesn't sequence them
var resolveTaskDependencies = function (tasks, names, results, missing) {
	if (!names || !names.length) {
		return;
	}
	var i, name, node;
	for (i = 0; i < names.length; i++) {
		name = names[i];

		if (results.indexOf(name) !== -1 || missing.indexOf(name) !== -1) {
			continue; // de-dup
		}

		node = tasks[name];
		if (!node) {
			missing.push(name);
			continue;
		}

		results.push(name);

		// discover their dependencies
		if (node.before.length) {
			resolveTaskDependencies(tasks, node.before, results, missing); // recurse
		}
		if (node.after.length) {
			resolveTaskDependencies(tasks, node.after, results, missing); // recurse
		}
	}
};

// get dependent tasks, doesn't sequence them
module.exports = function (args, cb) {
	var allTasks = args.orchestrator.tasks; // all the registered tasks
	var runNames = args.runTaskNames; // the names of the tasks passed to #run()

	var results = [];
	var missing = [];
	resolveTaskDependencies(allTasks, runNames, results, missing);

	if (missing.length) {
		var err = new Error('tasks not defined: '+missing.join(', '));
		err.missingTasks = missing;
		return cb(err);
	}

	args.runTaskNames = results; // now includes dependencies

	cb(null);
};
