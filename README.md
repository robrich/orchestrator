![status](https://secure.travis-ci.org/robrich/orchestrator.png?branch=master)

Orchestrator
============

A module for sequencing and executing tasks and dependencies in maximum concurrency

Usage
-----

### 1. Get a reference:

```javascript
var Orchestrator = require('orchestrator');
var orchestrator = new Orchestrator();
```

### 2. Load it up with stuff to do:

A synchronous task:

```javascript
orchestrator.add('thing1', function(){
  // do stuff
});
```

An asynchronous task:

```javascript
orchestrator.add('thing2', function(callback){
  // do stuff
  callback(err);
});
```

An asynchronous task using promises:

```javascript
var Q = require('q');

orchestrator.add('thing3', function(){
  var deferred = Q.defer();

  // do async stuff
  setTimeout(function () {
    deferred.resolve();
  }, 1);

  return deferred.promise;
});
```

An asynchronous task using streams: (task is marked complete when stream ends)

```javascript
var es = require('event-stream');

orchestrator.add('thing4', function(){
  var stream = es.map(function (args, cb) {
    cb(null, args);
  });
  // do stream stuff
  return stream;
});
```

A task that requires other tasks be done first:

```javascript
orchestrator.add('thing4', ['thing1','thing2','thing3'], function(){
  // do stuff
});
```

### 3. Run the tasks:

Start the tasks you want to run:

```javascript
orchestrator.start('thing1','thing2','thing3', 'thing4');
```

or start all the tasks:

```javascript
orchestrator.start();
```

or specify a callback for when all tasks are complete:

```javascript
orchestrator.start('thing1', function (err) {
  // all done
});
```

FRAGILE: Orchestrator catches exceptions on sync runs to pass to your callback
but doesn't hook to process.uncaughtException so it can't pass those exceptions
to your callback

FRAGILE: Orchestrator will ensure each task and each dependency is run once during an orchestration run
even if you specify it to run more than once. (e.g. `orchestrator.start('thing1', 'thing1')`
will only run 'thing1' once.) If you need it to run a task multiple times, wait for
the orchestration to end (start's callback) then call start again.
(e.g. `orchestrator.start('thing1', function () {orchestrator.start('thing1');})`.)
Alternatively create a second orchestrator instance.

### 4. Optionally listen to it's internals

```javascript
orchestrator.on('task_start', function (e) {
  // e.message is the log message
  // e.task is the task name if the message applies to a task else `undefined`
  // e.err is the error if event is 'err' else `undefined`
});
// for task_end and task_err:
orchestrator.on('task_stop', function (e) {
  // e is the same object from task_start
  // e.message is updated to show how the task ended
  // e.duration is the task run duration (in seconds)
});
```

Events include:
- start: from start() method, shows you the task sequence
- stop: from stop() method, the queue finished successfully
- err: from stop() method, the queue was aborted due to a task error
- task_start: from _runTask() method, task was started
- task_stop: from _runTask() method, task completed successfully
- task_err: from _runTask() method, task errored

Note: fires either *stop or *err but not both.

*Listen to all events*

```javascript
orchestrator.onAll(orchestrator, function (e) {
  // e is the original event args
  // e.src is event name
});
```

### 5. Enjoy!

LICENSE
-------

(MIT License)

Copyright (c) 2013 [Richardson & Sons, LLC](http://richardsonandsons.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
