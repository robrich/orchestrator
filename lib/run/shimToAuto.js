'use strict';

// build the async.auto object for each task
module.exports = function (cb, args) {
	var allTasks = args.runTasks;
	var autoTasks = {};

	allTasks.forEach(function (task) {
		var name = task.name;
		var arr = task.dep;
		var fn = task.fnAuto;
		arr.push(fn);
		autoTasks[name] = arr;
	});
	args.runAutoTasks = autoTasks;

	cb(null, args);
};
