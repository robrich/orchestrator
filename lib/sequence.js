/*jshint node:true */

"use strict";

// TODO: should this be a separate module?

var sequence = function (tasks, names, results, nest) {
	var i, name, node;
	for (i = 0; i < names.length; i++) {
		name = names[i];
		if (results.indexOf(name) === -1) {
			node = tasks[name];
			if (!node) {
				throw new Error(name+' is not defined');
			}
			if (nest.indexOf(name) > -1) {
				throw new Error('Recursive dependencies detected: '+nest.join(' -> ')+' -> '+name);
			}
			if (node.dep.length) {
				nest.push(name);
				sequence(tasks, node.dep, results, nest); // recurse
				nest.pop(name);
			}
			results.push(name);
		}
	}
	// TODO: de-dup results?
};

module.exports = sequence;
