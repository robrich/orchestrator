'use strict';

var sequencify = require('sequencify');

// sequence the tasks
function sequenceTasks (args, cb) {
	var allTasks = args.runTasks; // the tasks to run
	var names = args.runTaskNames; // the names of the tasks to run

	var results = sequencify(allTasks, names);
	var seq = results.sequence;
	var err;

	if (results.missingTasks.length) {
		err = new Error('tasks not defined: '+results.missingTasks.join(', '));
		err.missingTasks = results.missingTasks;
		return cb(err);
	}
	if (results.recursiveDependencies.length) {
		// technically there could've been more than one recursion chain, but you probably would rather handle just one
		err = new Error('Recursive dependencies detected: '+results.recursiveDependencies[0].join(' -> '));
		err.recursiveTasks = results.recursiveDependencies[0];
		return cb(err);
	}

	args.runTaskNames = seq; // now in order

	cb(null);
}

module.exports = sequenceTasks;
