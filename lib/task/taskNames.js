'use strict';

// Orchestrator#taskNames() -- return all defined task names
function taskNames() {
	return Object.keys(this.tasks);
}

module.exports = taskNames;
