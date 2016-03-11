# Heap Server-Side API Client for Node.js

[![Build Status](https://travis-ci.org/heap/heap-node.svg?branch=master)](https://travis-ci.org/heap/heap-node)
[![Coverage Status](https://coveralls.io/repos/github/heap/heap-node/badge.svg?branch=master)](https://coveralls.io/github/heap/heap-node?branch=master)
[![Dependency Status](https://gemnasium.com/heap/heap-node.svg)](https://gemnasium.com/heap/heap-node)
[![NPM Version](http://img.shields.io/npm/v/heap-api.svg)](https://www.npmjs.org/package/heap-api)

This is a [node.js](https://nodejs.org/) client for the
[Heap](https://heapanalytics.com/)
[server-side API](https://heapanalytics.com/docs/server-side).


## Prerequisites

This package is tested on node.js 0.10 and above.


## Installation

Install using [npm](https://www.npmjs.com/).

```bash
npm install heap-api@1.x --save
```


## Usage

Create an API client.

```javascript
var heap = require('heap-api')('YOUR_APP_ID');
```

### Recommended Usage Patterns


[Track](https://heapanalytics.com/docs/server-side#track) a server-side event
in a fire-and-forget fashion.

```javascript
heap.track('event-name', 'user-identity');
heap.track('event-name', 'user-identity', { property: 'value' });
```

[Add properties](https://heapanalytics.com/docs/server-side#identify) to a
user. Take advantage of the returned
[ES6 Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
to do more work when the call completes.

```javascript
heap.addUserProperties('user-identity', { plan: 'premium1' })
.then(function() {
  // Do more work.
});
```

Set up an [event](https://nodejs.org/api/events.html) listener to log Heap API
call failures.

```javascript
heap.on('error', function(error) {
  console.error(error);
});
```

### Callback-Based Usage

Track a server-side event.

```javascript
heap.track('event-name', 'user-identity', function(error) {
  if (error)
    console.error(error);
});
```

Track a server-side event with properties.

```javascript
heap.track('event-name', 'user-identity', { property: 'value' }, function(error) {
  if (error)
    console.error(error);
});
```

Add properties to a user.

```javascript
heap.addUserProperties('user-identity', { plan: 'premium1' }, function(error) {
  if (error)
    console.error(error);
});
```

### Promise-Based Usage

The methods described above return
[ES6 Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
The promises can be safely ignored. `track` is a good candidate for
fire-and-forget usage.

```javascript
heap.track('event-name', 'user-identity');
```

Alternatively, the promises can be used to learn when an API call completes or
fails.

```javascript
heap.addUserProperties('user-identity', { plan: 'premium1' })
.then(function() {
  console.log("API call succeeded");
});
.catch(function(error) {
  console.error(error);
});
```

The Promises are created using
[any-promise](https://www.npmjs.com/package/any-promise), which can be
configured to use your application's favorite Promise implementation. The
[v8 Javascript engine](https://developers.google.com/v8/) versions used by
node.js 0.12 and above include a native Promise implementation that is used by
default.

```javascript
require('any-promise/register')('when');
```

On node.js 0.10 and below, you must either explicitly configure a Promise
library, or install a polyfill such as
[es6-promises](https://www.npmjs.com/package/es6-promises), as shown below.

```javascript
require('es6-promises').polyfill();
```

### Stubbing

In some testing environments, connecting to outside servers is undesirable. Set
the `stubbed` property to `true` to have all API calls succeed without
generating any network traffic.

```javascript
beforeEach(function() {
  heap.stubbed = true;
});
afterEach(function() {
  heap.stubbed = false
});
```

Alternatively, pass the `stubbed` option when creating the API client.
```javascript
var heap = require('heap-api')('YOUR_APP_ID', { stubbed: true });
```


## Development

After cloning the repository, install the dependencies.

```bash
npm install
```

Make sure the tests pass after making a change.

```bash
npm test
```

When adding new functionality, make sure it has good test coverage.

```bash
npm run cov
```

When adding new functionality, also make sure that the documentation looks
reasonable.

```bash
npm run doc
```

If you submit a
[pull request](https://help.github.com/articles/using-pull-requests/),
[Travis CI](https://travis-ci.org/) will run the test suite against your code
on the node versions that we support. Please fix any errors that it reports.


## Copyright

Copyright (c) 2016 Heap Inc., released under the MIT license.
