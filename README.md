# ratelimit
ratelimit is a nodejs module for working with ratelimits using promises.

## Installation
```sh
npm install https://github.com/missingsemi/ratelimit
```

## Usage
```js
const Ratelimit = require('ratelimit');

// Defines a new ratelimit that resolves 10 times per 1000 millisecond window.
const rl = new Ratelimit(10, 1000);

async function main() {
    // This for loop will only be able to run 10 times per second, so it should take 10 seconds to complete.
    for (let i = 0; i < 100; i++) {
        // If the ratelimit is met, wait until it resets.
        await rl.wait();
        console.count('Waited');
    }
}

// Runs the example and then cleans up the ratelimit.
main().then(() => rl.kill()).catch(console.error);
```
Ratelimit.wait() returns a promise so it works with await as well.


The Ratelimit constructor takes two arguments. The first argument describes how many promises are resolved before the ratelimit is reached. The second describes the duration of each limit. At the end of this duration, the next set of promises will be resolved.

Function          |Usage   
------------------|------------------------------------------------------------------------
Ratelimit.wait()      |Returns a promise that resolves as soon as the ratelimit is not met.
Ratelimit.start()     |Starts a stopped Ratelimit object.
Ratelimit.pause()     |Stops a Ratelimit object without rejecting any promises.
Ratelimit.kill()      |Stops a Ratelimit object and rejects all pending promises.
Ratelimit.remaining() |Returns the remaining number of requests before being ratelimited.
## Notes
Ratelimit objects are started on construction, so Ratelimit.start() does not need to be called when making a new object.

Ratelimit objects rely on setInterval, so make sure to pause or kill them so your program can close.

Ratelimit.wait() works on a FIFO basis, so old promises are resolved before new promises.

## Todo
Create a stop() function that will cause Ratelimit.wait() to reject all new promises, but will resolve all old promises before clearing the interval.
