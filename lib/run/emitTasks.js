'use strict';

// instrument an action, emiting events on start, error, and end

var start = function (args, cb) {
	var orchestrator = args.orchestrator;
	var tasks = args.runTaskNames;

	// tell them we're beginning
	args.emitArgs = {
		tasks: tasks,
		message: 'running '+tasks.join(', ')
	};
	orchestrator.emit.call(orchestrator, 'start', args.emitArgs);

	cb(null);
};

var end = function (err, args, cb) {
	var orchestrator = args.orchestrator;
	var tasks = args.runTaskNames;

	// tell them what happened
	args.emitArgs.duration = args.duration;
	if (err) {
		args.emitArgs.err = err;
		args.message = 'failed '+tasks.join(', ');
		orchestrator.emit.call(orchestrator, 'error', args.emitArgs);
	} else {
		args.message = 'succeeded '+tasks.join(', ');
	}
	orchestrator.emit.call(orchestrator, 'end', args.emitArgs);

	cb(null);
};

module.exports = {
	start: start,
	end: end
};
