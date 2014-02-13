'use strict';

// Orchestrator#hasTask() -- is there a task with this name?
module.exports = function (name) {
	return !!this.tasks[name];
};
