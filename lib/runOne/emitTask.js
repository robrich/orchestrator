'use strict';

// instrument an action, emiting events on task start, error, and end

var start = function (args, cb) {
	var task = args.task;
	var orchestrator = args.orchestrator;

	// tell them we're beginning
	task.message = task.name+' started';
	orchestrator.emit.call(orchestrator, 'taskStart', task);

	cb(null);
};

var end = function (args, cb) {
	var task = args.task;
	var orchestrator = args.orchestrator;
	task.message = task.name+' '+task.runMethod;

	// tell them what happened
	if (task.err) {
		orchestrator.emit.call(orchestrator, 'taskError', task);
	}
	orchestrator.emit.call(orchestrator, 'taskEnd', task);

	cb(null);
};

module.exports = {
	start: start,
	end: end
};
