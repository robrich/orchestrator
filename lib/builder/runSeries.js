'use strict';

var getCallback = require('./lib/getCallback');

// sugar for calling this.series then this.run with the results
// this is very similar to require('runParallel') but not abstracted to avoid the complexity
function runSeries() {

	var args = Array.prototype.slice.call(arguments, 0);
	var cb = getCallback(args);

	/*jshint validthis:true */
	return this.run(this.series.apply(this, args), cb);
	/*jshint validthis:false */
}

module.exports = runSeries;
