'use strict';

// return all defined task names
module.exports = function () {
	return Object.keys(this.tasks);
};
