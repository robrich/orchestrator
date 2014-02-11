'use strict';

// the state (args) passed between all runOne tasks
module.exports = function (task, orchestrator) {
	return {
		task: task,
		orchestrator: orchestrator
	};
};
