'use strict';

// the state (args) passed between all runOne tasks
module.exports = function (task, orchestrator) {
	// TODO: consider throwing if either is not defined
	return {
		task: task,
		orchestrator: orchestrator
	};
};
