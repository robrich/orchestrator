'use strict';

var makeArgs = require('../runOne/args');

// make a function that will `../runOne` for each task
function makeRunOneFn (args, cb) {
	var allTasks = args.runTasks;
	var runOneFn = args.runOneFn;
	var orchestrator = args.orchestrator;

	Object.keys(allTasks).forEach(function (prop) {
		var task = allTasks[prop];

		var runOneArgs = makeArgs(task, orchestrator);
		var runOneBound = runOneFn.bind(orchestrator, runOneArgs);
		// this as orchestrator isn't necessary, but it seems as good as anything else
		task.fnAuto = runOneBound;
	});

	cb(null);
}

module.exports = makeRunOneFn;
