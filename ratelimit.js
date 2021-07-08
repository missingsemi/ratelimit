function Ratelimit(max, duration) {
    this.max = max;
    this.duration = duration;

    // "private" vars for internal use only
    this._count = 0;
    this._interval = setInterval(this.reset.bind(this), duration);
    this._promises = [];
}

// Resets count and resolves as many promises as possible before running out or hitting max.
Ratelimit.prototype.reset = function () {
    this._count = 0;
    let m = Math.min(this.max, this._promises.length);
    for (let i = 0; i < m; i++) {
        this._promises.shift()[0]();
        this._count++;
    }
}

// Instant resolves if ratelimit isnt reached, otherwise add to queue.
Ratelimit.prototype.wait = function () {
    return new Promise((resolve, reject) => {
        if (!this._interval) {
            reject();
        } else if (this._count < this.max) {
            resolve();
            this._count++;
        } else {
            this._promises.push([resolve, reject]);
        }
    })
}

// Creates new interval to resuse a stopped ratelimit.
Ratelimit.prototype.start = function () {
    if (this._interval) clearInterval(this._interval);
    this._interval = setInterval(this.reset.bind(this), this.duration);
}

// Stops calling .reset() but keeps promises in queue to be resumed later.
Ratelimit.prototype.pause = function () {
    clearInterval(this._interval);
}

// Clears interval and rejects all unresolved promises.
Ratelimit.prototype.kill = function () {
    clearInterval(this._interval);
    this._promises.forEach((p) => {
        p[1]();
    });
    this._promises = [];
}

module.exports = Ratelimit;