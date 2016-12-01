"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var path = require('path'), appDir = path.resolve('./');
var Fs = require("fs");
var events_1 = require("events");
var File = (function (_super) {
    __extends(File, _super);
    function File(fileName) {
        _super.call(this);
        this.fileName = path.resolve(appDir + "/public/" + fileName);
    }
    /**
     *
     * @returns {Promise<string>}
     */
    File.prototype.read = function () {
        var _this = this;
        var stats;
        return this.exists()
            .then(function () {
            return _this.stats();
        })
            .then(function (_stats_) {
            stats = _stats_;
            return _this.open();
        })
            .then(function (fd) {
            return _this.readFile(fd, stats);
        });
    };
    /**
     *
     */
    File.prototype.exists = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Fs.exists(_this.fileName, function (exists) {
                if (exists) {
                    resolve();
                }
                else {
                    reject(false);
                }
            });
        });
    };
    /**
     *
     * @returns {Promise<Fs.Stats>}
     */
    File.prototype.stats = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            Fs.stat(_this.fileName, function (err, stats) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(stats);
            });
        });
    };
    /**
     *
     * @param flags
     * @returns {Promise<number>}
     */
    File.prototype.open = function (flags) {
        var _this = this;
        if (flags === void 0) { flags = "r"; }
        return new Promise(function (resolve, reject) {
            Fs.open(_this.fileName, flags, function (err, fd) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(fd);
            });
        });
    };
    /**
     *
     * @param fd
     * @param stats
     * @returns {Promise<string>}
     */
    File.prototype.readFile = function (fd, stats) {
        return new Promise(function (resolve, reject) {
            var buffer = new Buffer(stats.size);
            Fs.read(fd, buffer, 0, buffer.length, null, function (err, bytesRead, buffer) {
                if (err) {
                    reject(err);
                    return;
                }
                var data = buffer.toString("utf8", 0, buffer.length);
                Fs.close(fd);
                resolve(data);
            });
        });
    };
    return File;
}(events_1.EventEmitter));
exports.File = File;
//# sourceMappingURL=File.js.map