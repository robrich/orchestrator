'use strict';

// the state (args) passed between all runOne tasks
function args(task, runOptions, orchestrator) {
	if (!task || !orchestrator || !runOptions) {
		throw new Error('Invalid options passed to runOne/args()');
	}
	return {
		task: task,
		orchestrator: orchestrator,
		runOptions: runOptions
	};
}

module.exports = args;
