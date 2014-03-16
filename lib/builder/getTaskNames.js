'use strict';

/*jshint latedef:nofunc */
function getTasksFromArray(inArray, outArray) {
	if (!inArray || !inArray.length) {
		return;
	}
	var err;
	inArray.forEach(function (item) {
		if (!item) {
			return;
		}
		if (typeof item === 'string') {
			if (outArray.indexOf(item) === -1) {
				outArray.push(item); // de-dup
			}
		} else if (typeof item === 'object' && item.isBuilder) {
			err = getTasksFromBuilder(item, outArray) || err; // recurse
		} else {
			err = new Error('invalid dependency tree: pass a task builder (e.g. series() or parallel()) to run()');
			err.taskInvalid = true;
		}
	});
	return err;
}
/*jshint latedef:true */

function getTasksFromBuilder(builder, outArray) {
	var err;
	// TODO: ignore invalid properties or die?
	err = getTasksFromArray(builder.series, outArray) || err;
	err = getTasksFromArray(builder.parallel, outArray) || err;
	return err;
}

// get all the task names represented by a builder tree
module.exports = function (builder, cb) {
	var taskNames = [];
	var err;
	if (!builder || !builder.isBuilder) {
		err = new Error('invalid dependency tree: pass a task builder (e.g. series() or parallel()) to run()');
		err.taskInvalid = true;
		return cb(err, taskNames);
	}
	err = getTasksFromBuilder(builder, taskNames);
	cb(err, taskNames);
};
