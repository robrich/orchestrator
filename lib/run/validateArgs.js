'use strict';

var getTaskNamesFromBuilder = require('../builder/getTaskNames');

// validate the builder, the options, and the callback function
function validateArgs(args, cb) {
	var builder = args.builder;
	args.runOptions = args.runOptions || {};
	var doneCallback = args.doneCallback;
	var err;

	if (doneCallback && typeof doneCallback !== 'function') {
		err = new Error('the done callback is not a function');
		err.callbackInvalid = true;
		err.cb = doneCallback;
		return cb(err);
	}

	if (args.runOptions && typeof args.runOptions !== 'object') {
		err = new Error('the options is not an object');
		err.optionsInvalid = true;
		err.options = args.runOptions;
		return cb(err);
	}

	args.continueOnError = args.runOptions.continueOnError || false;

	getTaskNamesFromBuilder(builder, function (err, taskNames) {
		args.runTaskNames = taskNames;
		cb(err);
	});
}

module.exports = validateArgs;
