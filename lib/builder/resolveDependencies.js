'use strict';

var validateBuilderArgs = require('./validateBuilderArgs');

// add depName as a dependency to taskName
function addTaskDependency(depName, taskName, allTasks, missingTasks) {
	if (Array.isArray(depName)) {
		depName.forEach(function (d) {
			addTaskDependency(d, taskName, allTasks, missingTasks);
		});
		return;
	}
	var task = allTasks[taskName];
	if (!task) {
		missingTasks.push(taskName);
		return;
	}
	if (task.before.indexOf(depName) === -1) {
		task.before.push(depName);
	}
}

function resolveBuilderInternal(builder, allTasks, missingTasks, invalidBuilders, parentDeps) {
	var previousStep = parentDeps;

	if (!builder || !builder.isBuilder) {
		invalidBuilders.push(builder);
		return;
	}

	// dependencies at this depth
	if (builder.series) {
		try {
			validateBuilderArgs(builder.series); // FRAGILE: it throws
		} catch (err) {
			invalidBuilders.push(builder);
			return;
		}

		// each one depends on the one before
		builder.series.forEach(function (s) {
			if (s.isBuilder) {
				previousStep = resolveBuilderInternal(s, allTasks, missingTasks, invalidBuilders, previousStep);
			} else {
				addTaskDependency(previousStep, s, allTasks, missingTasks);
				previousStep = s; // the next one is dependent on me
			}
		});
	}
	if (builder.parallel) {
		try {
			validateBuilderArgs(builder.parallel); // FRAGILE: it throws
		} catch (err) {
			invalidBuilders.push(builder);
			return;
		}
		var nextStep = [];

		// they don't depend on each other, but all depend on previous levels
		builder.parallel.forEach(function (p) {
			if (p.isBuilder) {
				var nextStepNest = resolveBuilderInternal(p, allTasks, missingTasks, invalidBuilders, previousStep);
				if (nextStepNest) {
					if (Array.isArray(nextStepNest)) {
						nextStep = nextStep.concat(nextStepNest);
					} else {
						nextStep.push(nextStepNest);
					}
				}
			} else {
				addTaskDependency(previousStep, p, allTasks, missingTasks);
				nextStep.push(p);
			}
		});
		previousStep = nextStep; // future things depend on all of me
	}

	return previousStep;
}


// add builder dependencies to tasks
function resolveDependencies(builder, allTasks, cb) {
	var missingTasks = [];
	var invalidBuilders = [];
	var err;
	resolveBuilderInternal(builder, allTasks, missingTasks, invalidBuilders, []);
	if (missingTasks.length > 0 && !err) {
		err = new Error('tasks not defined: '+missingTasks.join(', '));
		err.missingTasks = missingTasks;
	}
	if (invalidBuilders.length > 0 && !err) {
		err = new Error('invalid dependency tree: pass a task builder (e.g. series() or parallel()) to run()');
		err.taskInvalid = true;
		err.builder = invalidBuilders[0];
	}
	cb(err);
}

module.exports = resolveDependencies;
