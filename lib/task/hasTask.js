'use strict';

// Orchestrator#hasTask() -- is there a task with this name?
function hasTask(name) {
	return !!this.tasks[name];
}

module.exports = hasTask;
