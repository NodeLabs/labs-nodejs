"use strict";
let path = require('path'), appDir = path.resolve('./');
const Fs = require("fs");
const events_1 = require("events");
const Promise = require("bluebird");
class File extends events_1.EventEmitter {
    constructor(fileName) {
        super();
        this.fileName = path.resolve(`${appDir}/public/${fileName}`);
    }
    /**
     *
     * @returns {Promise<string>}
     */
    read() {
        let stats;
        return this.exists()
            .then(() => {
            return this.stats();
        })
            .then((_stats_) => {
            stats = _stats_;
            return this.open();
        })
            .then((fd) => {
            return this.readFile(fd, stats);
        });
    }
    /**
     *
     */
    exists() {
        return new Promise((resolve, reject) => {
            Fs.exists(this.fileName, (exists) => {
                if (exists) {
                    resolve();
                }
                else {
                    reject(false);
                }
            });
        });
    }
    /**
     *
     * @returns {Promise<Fs.Stats>}
     */
    stats() {
        return new Promise((resolve, reject) => {
            Fs.stat(this.fileName, (err, stats) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(stats);
            });
        });
    }
    /**
     *
     * @param flags
     * @returns {Promise<number>}
     */
    open(flags = "r") {
        return new Promise((resolve, reject) => {
            Fs.open(this.fileName, flags, (err, fd) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(fd);
            });
        });
    }
    /**
     *
     * @param fd
     * @param stats
     * @returns {Promise<string>}
     */
    readFile(fd, stats) {
        return new Promise((resolve, reject) => {
            let buffer = new Buffer(stats.size);
            Fs.read(fd, buffer, 0, buffer.length, null, (err, bytesRead, buffer) => {
                if (err) {
                    reject(err);
                    return;
                }
                var data = buffer.toString("utf8", 0, buffer.length);
                Fs.close(fd);
                resolve(data);
            });
        });
    }
}
exports.File = File;
//# sourceMappingURL=File.js.map