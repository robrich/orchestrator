'use strict';

// instrument an action, emiting events on task start, error, and end

var start = function (cb, args) {
	var task = args.task;
	var orchestrator = args.orchestrator;

	// tell them we're beginning
	task.message = task.name+' started';
	orchestrator.emit.call(orchestrator, 'taskRun', task);

	cb(null, args);
};

var end = function (cb, args) {
	var task = args.task;
	var orchestrator = args.orchestrator;
	task.message = task.name+' '+task.stats.runMethod;

	// tell them what happened
	if (task.err) {
		orchestrator.emit.call(orchestrator, 'taskError', task);
	}
	orchestrator.emit.call(orchestrator, 'taskEnd', task);

	cb(null, args);
};

module.exports = {
	start: start,
	end: end
};
