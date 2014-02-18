'use strict';

// normalize before: [] and after: [] into dep: []
module.exports = function (args, cb) {
	var allTasks = args.runTasks;
	var missing = [];
	var err;

	// get before dependencies
	Object.keys(allTasks).forEach(function (prop) {
		var task = allTasks[prop];
		if (!task) {
			missing.push(prop);
			return;
		}

		task.dep = task.before.slice(0); // duplicate
		// TODO: ensure dependencies exist?
		// TODO: dedup?
	});

	// get after dependencies, resolve each into a "before" for the other task
	Object.keys(allTasks).forEach(function (prop) {
		var task = allTasks[prop];

		var name = task.name; // TODO: use prop instead?

		task.after.forEach(function (dep) {
			var otherTask = allTasks[dep];
			if (!otherTask) {
				missing.push(dep);
			} else if (otherTask.dep.indexOf(name) === -1) {
				otherTask.dep.push(name);
			}
		});
	});

	if (missing.length > 0) {
		err = new Error('tasks not defined: '+missing.join(', '));
		err.missingTasks = missing;
		return cb(err);
	}

	cb(null);
};
