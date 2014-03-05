'use strict';

function throwError(arg) {
	var err = new Error('invalid dependency tree: pass a task builder to run() or call runParallel() or runSeries()');
	err.taskInvalid = true;
	if (arg) {
		err.arg = arg;
	}
	throw err;
}

// validate that each argument in the builder is either a string or a builder
function validateBuilderArgs(args) {
	if (!args) {
		throwError();
	}

	if (args.length === 0) {
		return; // an array of zero is fine ... albeit unnecessary
	}

	args.forEach(function (item) {
		if (!item) {
			throwError();
		}
		if (typeof item !== 'string' && !(typeof item === 'object' && item.isBuilder)) {
			throwError(item);
		}
	});
}

module.exports = validateBuilderArgs;
