'use strict';

var sequence = require('sequencify');

// get dependent tasks
module.exports = function (cb, args) {
	var allTasks = args.orchestrator.tasks;
	var names = args.runTaskNames;

	var seq = [];
	try {
		sequence(allTasks, names, seq, []);
	} catch (err) {
		return cb(err, args);
	}

	args.runTaskNames = seq; // now includes dependencies

	cb(null, args);
};
