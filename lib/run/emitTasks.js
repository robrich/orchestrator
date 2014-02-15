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
	args.emitArgs.message = null;

	cb(null);
};

var end = function (err, args, cb) {
	var orchestrator = args.orchestrator;
	var tasks = args.runTaskNames;

	// tell them what happened
	if (!args.emitArgs) {
		// we failed before we got to emitTasks#start()
		args.emitArgs = {
			tasks: tasks
		};
	}
	args.emitArgs.duration = args.duration;
	if (err) {
		args.emitArgs.err = err;
		args.emitArgs.message = 'failed '+tasks.join(', ');
		orchestrator.emit.call(orchestrator, 'error', args.emitArgs);
	} else {
		args.emitArgs.message = 'succeeded '+tasks.join(', ');
	}
	orchestrator.emit.call(orchestrator, 'end', args.emitArgs);

	cb(null);
};

module.exports = {
	start: start,
	end: end
};
