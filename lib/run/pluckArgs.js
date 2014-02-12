'use strict';

var getStrings = function (inArray, outArray) {
	var err;
	if (!Array.isArray(inArray) || inArray.length < 1) {
		return;
	}
	inArray.forEach(function (a) {
		if (typeof a === 'string') {
			if (outArray.indexOf(a) === -1) {
				outArray.push(a);
			}
		} else if (Array.isArray(a)) {
			getStrings(a, outArray); // recurse
		} else {
			err = new Error('pass strings or arrays of strings');
		}
	});
	return err;
};

// pluck run() arg names and callback function
module.exports = function (args, cb) {
	var lastTask, doneCallback, taskNames = [], err;
	var runArgs = args.runArgs;

	if (runArgs.length) {
		lastTask = runArgs[runArgs.length-1];
		if (typeof lastTask === 'function') {
			doneCallback = lastTask;
			runArgs.pop();
		}
	}

	err = getStrings(runArgs, taskNames);

	args.runTaskNames = taskNames;
	args.doneCallback = doneCallback;
	
	cb(err);
};
