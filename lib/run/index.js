'use strict';

var async = require('async');

var timeRun = require('./timeRun');
var pluckArgs = require('./pluckArgs');
var resolveDependencies = require('./resolveDependencies');
var pluckTasks = require('./pluckTasks');
var validateTasks = require('./validateTasks');
var emitTasks = require('./emitTasks');
var cloneTasks = require('./cloneTasks');
var makeRunOneFn = require('./makeRunOneFn');
var shimToAuto = require('./shimToAuto');
var runQueue = require('./runQueue');

var runOne = require('../runOne');

// Orchestrator#run() -- run the selected tasks, their dependencies, and call the callback when done
module.exports = function() {

	var args = {
		runOneFn: runOne,
		runArgs: Array.prototype.slice.call(arguments, 0),
		orchestrator: this
	};

	return async.series([
		// setup and run
		timeRun.start,
		pluckArgs,
		resolveDependencies,
		pluckTasks,
		validateTasks,
		emitTasks.start,
		cloneTasks,
		makeRunOneFn,
		shimToAuto,
		runQueue
	].map(function (fn) {
		// stick args on the front of everything
		return fn.bind(this, args);
	}), function (err1/*, results*/) {

		async.series([
			// cleanup from run and report
			timeRun.end,
			emitTasks.end.bind(null, err1)
		].map(function (fn) {
			// stick args on the front of everything
			return fn.bind(this, args);
		}), function (err2/*, results*/) {

			// tell the user what happened
			var cb = args.doneCallback;
			var err = err1 || err2;
			if (cb) {
				return cb(err, args.emitArgs);
			} else if (err) {
				throw err;
			//} else {
				// done successfully and you didn't want to know
			}
		});
	});

};
