'use strict';

var makeArgs = require('../runOne/args');

// make a function that will `../runOne` for each task
module.exports = function (cb, args) {
	var allTasks = args.runTasks;
	var runOneFn = args.runOneFn;
	var orchestrator = args.orchestrator;

	allTasks.forEach(function (task) {
		var runOneArgs = makeArgs(task, orchestrator);
		var runOneBound = runOneFn.bind(orchestrator, runOneArgs);
		task.fnAuto = runOneBound;
	});

	cb(null, args);
};
