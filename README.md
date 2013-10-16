![status](https://secure.travis-ci.org/robrich/orchestsrator.png?branch=master)

Orchestrator
============

A system for organizing dependent tasks

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
orchestrator.task('thing1', function(){
  // do stuff
});
```

An asynchronous task:

```javascript
orchestrator.task('thing2', function(callback){
  // do stuff
  callback(err);
});
```

An asynchronous task using promises:

```javascript
var Q = require('q');

orchestrator.task('thing3', function(){
  var deferred = Q.defer();

  // do async stuff
  setTimeout(function () {
    deferred.resolve();
  }, 1);

  return deferred.promise;
});
```

A task that requires other tasks be done first:

```javascript
orchestrator.task('thing4', ['thing1','thing2','thing3'], function(){
  // do stuff
});
```

### 3. Run the tasks:

Specify the tasks you want to run:

```javascript
orchestrator.run('thing1','thing2','thing3', 'thing4');
```

or run all the tasks:

```javascript
orchestrator.run();
```

specify a callback to run when all tasks are complete:

```javascript
orchestrator.run('thing1', function (err) {
  // all done
});
```

FRAGILE: Orchestrator catches exceptions on sync runs but doesn't hook to process.uncaughtException

### 4. Enjoy!

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
