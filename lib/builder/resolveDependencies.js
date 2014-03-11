'use strict';

var validateBuilderArgs = require('./validateBuilderArgs');

// add depName as a dependency to taskName
function addTask(depName, taskName, allTasks, missingTasks) {
	var task = allTasks[taskName];
	if (!task) {
		missingTasks.push(taskName);
		return;
	}
	if (task.before.indexOf(depName) === -1) {
		task.before.push(depName);
	}
}

function resolveBuilderInternal(builder, allTasks, missingTasks, nest, level) {
	var previousStep, err;

	if (!builder || !builder.isBuilder) {
		err = new Error('invalid dependency tree: pass a task builder to run() or call runParallel() or runSeries()');
		err.taskInvalid = true;
		return err;
	}

	if (builder.series) {
		validateBuilderArgs(builder.series); // FRAGILE: it throws

		// each one depends on the one before
		builder.series.forEach(function (s) {
			if (previousStep) {
				if (s.isBuilder) {
					err = resolveBuilderInternal(s, allTasks, missingTasks, nest, level+1) || err;
				} else {
					addTask(previousStep, s, allTasks, missingTasks);
				}
			}
			previousStep = s;
		});
	} else if (builder.parallel) {
		validateBuilderArgs(builder.parallel); // FRAGILE: it throws

		// this builder's steps run in parallel, no need to run this 
	}
	return err;
}


// add builder dependencies to tasks
function resolveDependencies(builder, allTasks, cb) {
	var missingTasks = [];
	var err = resolveBuilderInternal(builder, allTasks, missingTasks, [], 0);
	if (missingTasks.length > 0 && !err) {
		err = new Error('tasks not defined: '+missingTasks.join(', '));
		err.missingTasks = missingTasks;
	}
	cb(err);
}

module.exports = resolveDependencies;
