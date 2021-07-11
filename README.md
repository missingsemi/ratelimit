# ratelimit
ratelimit is a nodejs module for working with ratelimits using promises.

## Installation
```sh
npm install https://github.com/missingsemi/ratelimit
```

## Usage
```js
const Ratelimit = require('ratelimit');

// Creates new ratelimit that resolves 3 promises every 500ms.
let rl = new Ratelimit(3, 500);

// Creates 20 ratelimited console.counts
for (let i = 0; i < 20; i++) {
    rl.wait()
        .then(_ => console.count("Resolve"))
}

// Cleans up the interval on the ratelimit so the program can close.
setTimeout(rl.kill.bind(rl), 5000);
```
Ratelimit.wait() returns a promise so it works with await as well.


The Ratelimit constructor takes two arguments. The first argument describes how many promises are resolved before the ratelimit is reached. The second describes the duration of each limit. At the end of this duration, the next set of promises will be resolved.

Function          |Usage   
------------------|------------------------------------------------------------------------
Ratelimit.wait()  |Returns a promise that resolves as soon as the ratelimit is not met.
Ratelimit.start() |Starts a stopped Ratelimit object.
Ratelimit.pause() |Stops a Ratelimit object without rejecting any promises.
Ratelimit.kill()  |Stops a Ratelimit object and rejects all pending promises.

## Notes
Ratelimit objects are started on construction, so Ratelimit.start() does not need to be called when making a new object.

Ratelimit objects rely on setInterval, so make sure to pause or kill them so your program can close.

Ratelimit.wait() works on a FIFO basis, so old promises are resolved before new promises.

## Todo
Create a stop() function that will cause Ratelimit.wait() to reject all new promises, but will resolve all old promises before clearing the interval.
