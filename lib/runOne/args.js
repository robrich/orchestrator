'use strict';

// the state (args) passed between all runOne tasks
function args(task, orchestrator) {
	// TODO: consider throwing if either is not defined
	return {
		task: task,
		orchestrator: orchestrator
	};
}

module.exports = args;
