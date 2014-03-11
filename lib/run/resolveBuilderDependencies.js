'use strict';

var resolveDependencies = require('../builder/resolveDependencies');

// add builder dependencies to tasks
function resolveBuilderDependencies(args, cb) {
	var runTasks = args.runTasks;
	var builder = args.builder;

	resolveDependencies(builder, runTasks, cb);
}

module.exports = resolveBuilderDependencies;
