'use strict';

var async = require('async');
var asyncIt = require('./asyncIt');
var emitTask = require('./emitTask');
var timeTask = require('./timeTask');
var timeoutTask = require('./timeoutTask');
var runTask = require('./runTask');
var doneOnce = require('./doneOnce');

// run a single task's function and supporting tasks
function runOne(args, cb) {
	return async.series([
		asyncIt.run,
		emitTask.start,
		timeTask.start,
		timeoutTask.run.bind(null, runTask.bind(null, args)),
		timeTask.end,
		doneOnce.run,
		emitTask.end
	].map(function (fn) {
		// stick args on the front of everything
		return fn.bind(null, args);
	}), function (err/*, results*/) {
		if (!err && args.task.err && !args.runOptions.continueOnError) {
			err = args.task.err;
		}
		process.nextTick(function () {
			cb(err);
		});
	});
}

module.exports = runOne;
