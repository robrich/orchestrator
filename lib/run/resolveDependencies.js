'use strict';

var sequence = require('sequencify');

// get dependent tasks
module.exports = function (args, cb) {
	var allTasks = args.orchestrator.tasks; // all the registered tasks
	var names = args.runTaskNames; // the names of the tasks passed to #run()

	var seq = [];
	try {
		sequence(allTasks, names, seq, []);
	} catch (err) {
		return cb(err);
	}

	args.runTaskNames = seq; // now includes dependencies

	cb(null);
};
