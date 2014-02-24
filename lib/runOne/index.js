'use strict';

var async = require('async');
var doneOnce = require('./doneOnce');
var emitTask = require('./emitTask');
var runTask = require('./runTask');
var timeoutTask = require('./timeoutTask');
var timeTask = require('./timeTask');

// run a single task's function and supporting tasks
function runOne(args, cb) {
	return async.series([
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
		cb(err || args.task.err);
	});
}

module.exports = runOne;
