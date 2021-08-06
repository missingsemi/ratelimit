function Ratelimit(max, duration, weak = false) {
    this.max = max;
    this.duration = duration;

    // "private" vars for internal use only
    this.count_ = 0;
    this.interval_ = setInterval(this.reset.bind(this), duration);
    this.stopInterval_ = undefined;
    this.promises_ = [];
    this.weak_ = weak;

    if (weak) this.interval_.unref();
}

// Resets count and resolves as many promises as possible before running out or hitting max.
Ratelimit.prototype.reset = function () {
    this.count_ = 0;
    let m = Math.min(this.max, this.promises_.length);
    for (let i = 0; i < m; i++) {
        this.promises_.shift()[0]();
        this.count_++;
    }
    
    if (this.stopInterval_ && this.promises_.length == 0) clearInterval(this.stopInterval_);
}

// Instant resolves if ratelimit isnt reached, otherwise add to queue.
Ratelimit.prototype.wait = function () {
    return new Promise((resolve, reject) => {
        if (!this.interval_) {
            reject();
        } else if (this.count_ < this.max) {
            resolve();
            this.count_++;
        } else {
            this.promises_.push([resolve, reject]);
        }
    })
}

// Creates new interval to resuse a stopped ratelimit.
Ratelimit.prototype.start = function () {
    if (this.interval_) clearInterval(this.interval_);
    this.interval_ = setInterval(this.reset.bind(this), this.duration);
    if (this.weak_) this.interval_.unref();
}

// Stops calling .reset() but keeps promises in queue to be resumed later.
Ratelimit.prototype.pause = function () {
    clearInterval(this.interval_);
}

// Clears interval and rejects all unresolved promises.
Ratelimit.prototype.kill = function () {
    clearInterval(this.interval_);
    this.promises_.forEach((p) => {
        p[1]();
    });
    this.promises_ = [];
}

// Returns the remaining number of times .wait() can be called in the current duration.
Ratelimit.prototype.remaining = function () {
    return this.max - this.count_;
}

Ratelimit.prototype.stop = function () {
    this.stopInterval_ = this.interval_;
    this.interval_ = undefined;
}


module.exports = Ratelimit;