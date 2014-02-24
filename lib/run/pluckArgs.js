'use strict';

function getStrings(inArray, outArray) {
	var err;

	if (!Array.isArray(inArray) || inArray.length < 1) {
		return;
	}

	inArray.forEach(function (a) {
		if (typeof a === 'string') {
			if (outArray.indexOf(a) === -1) {
				outArray.push(a); // de-dup
			}
		} else {
			err = new Error('pass strings or arrays of strings');
			err.taskInvalid = true;
		}
	});

	return err;
}

// pluck run() arg names and callback function
function pluckArgs(args, cb) {
	var lastTask, doneCallback, taskNames = [], err;
	// runArgs is run()'s arguments -- think `orchestrator.run.apply(orchestrator, runArgs)`
	var runArgs = args.runArgs;

	if (runArgs.length) {
		lastTask = runArgs[runArgs.length-1];
		if (typeof lastTask === 'function') {
			doneCallback = lastTask;
			runArgs.pop();
		}
	}

	if (runArgs.length === 1 && Array.isArray(runArgs[0])) {
		err = getStrings(runArgs[0], taskNames);
	} else {
		// ASSUME: string parameters
		err = getStrings(runArgs, taskNames);
	}
	if (err) {
		taskNames = []; // Don't pass back only part of the list
	}

	args.runTaskNames = taskNames;
	args.doneCallback = doneCallback;

	cb(err);
}

module.exports = pluckArgs;
