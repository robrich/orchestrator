/*jshint node:true */

"use strict";

var Orchestrator = function (opts) {
	opts = opts || {};
	this.verbose = opts.verbose || false; // show messages as each task runs
	this.doneCallback = opts.callback; // call this when all tasks in the queue are done
	this.taskQueue = opts.taskQueue || []; // the order to run the tasks
	this.tasks = {}; // task objects: name, dep (list of names of dependencies), fn (the task to run)
	this.isRunning = false; // is the orchestrator running tasks?
};

Orchestrator.prototype = {
	reset: function () {
		this.stop(null);
		this.tasks = {};
		this.taskQueue = [];
		this.isRunning = false;
		this.doneCallback = undefined;
		return this;
	},
	add: function (name, dep, fn) {
		if (!fn) {
			fn = dep;
			dep = undefined;
		}
		if (!name || !fn) {
			throw new Error('Task requires a name and a function to execute');
		}
		// TODO: validate name is a string, dep is an array of strings, and fn is a function
		this.tasks[name] = {
			fn: fn,
			dep: dep || [],
			name: name
		};
		return this;
	},
	// tasks and optionally a callback
	run: function() {
		var names, lastTask, i, seq = [];
		names = [].slice.call(arguments, 0);
		if (names.length) {
			lastTask = names[names.length-1];
			if (typeof lastTask === 'function') {
				this.doneCallback = lastTask;
				names.pop();
			}
		}
		if (this.isRunning) {
			// if you call run() again while a previous run is still in play
			// append the new tasks to the existing task queue
			names = this.taskQueue.concat(names);
		}
		if (names.length < 1) {
			// run all tasks
			for (i = 0; i < this.tasks.length; i++) {
				names.push(this.tasks[i].name);
			}
		}
		seq = [];
		this.sequence(this.tasks, names, seq, []);
		this.taskQueue = seq;
		if (this.verbose) {
			console.log('[taskQueue: '+this.taskQueue.join(',')+']');
		}
		if (!this.isRunning) {
			this.isRunning = true;
			this._runStep();
		}
		return this;
	},
	sequence: require('./lib/sequence'),
	_runStep: function () {
		var i, task, allDone = true;
		if (!this.isRunning) {
			return; // They aborted it
		}
		for (i = 0; i < this.taskQueue.length; i++) {
			task = this.tasks[this.taskQueue[i]];
			if (!task.done && !task.running) {
				if (this._readyToRunTask(task)) {
					this._runTask(task);
				}
			}
			if (!task.done) {
				allDone = false;
			}
			if (!this.isRunning) {
				return; // Task failed or user aborted
			}
		}
		if (allDone) {
			this.stop(null, allDone);
		}
	},
	stop: function (err, allDone) {
		this.isRunning = false;
		if (this.verbose) {
			if (err) {
				console.log('[orchestration failed]');
			} else if (allDone) {
				console.log('[orchestration succeeded]');
			} else {
				console.log('[orchestration aborted]'); // ASSUME
			}
		}
		if (this.doneCallback) {
			this.doneCallback(err);
		}
	},
	_readyToRunTask: function (task) {
		var ready = true, // No one disproved it yet
			i, name, t;
		if (task.dep.length) {
			for (i = 0; i < task.dep.length; i++) {
				name = task.dep[i];
				t = this.tasks[name];
				if (!t.done) {
					ready = false;
					break;
				}
			}
		}
		return ready;
	},
	_runTask: function (task) {
		var that = this, cb, p;
		if (this.verbose) {
			console.log('['+task.name+' started]');
		}
		task.running = true;
		cb = function (err) {
			task.running = false;
			task.done = true;
			if (that.verbose) {
				console.log('['+task.name+' calledback]');
			}
			if (err) {
				return that.stop.call(that, err);
			}
			that._runStep.call(that);
		};
		try {
			p = task.fn.call(this, cb);
		} catch (err) {
			this.stop(err || task.name+' threw an exception');
		}
		if (p && p.done) {
			// wait for promise to resolve
			// FRAGILE: ASSUME: Promises/A+, see http://promises-aplus.github.io/promises-spec/
			p.done(function () {
				task.running = false;
				task.done = true;
				if (that.verbose) {
					console.log('['+task.name+' resolved]');
				}
				that._runStep.call(that);
			}, function(err) {
				task.running = false;
				task.done = true;
				if (that.verbose) {
					console.log('['+task.name+' rejected]');
				}
				that.stop.call(that, err || task.name+' promise rejected');
			});
		} else if (!task.fn.length) {
			// no promise, no callback, we're done
			if (this.verbose) {
				console.log('['+task.name+' finished]');
			}
			task.running = false;
			task.done = true;
		//} else {
			// FRAGILE: ASSUME: callback
		}
	}
};

module.exports = Orchestrator;
