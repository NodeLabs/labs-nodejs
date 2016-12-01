"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Mongoose = require('mongoose');
var events_1 = require("events");
Mongoose.Promise = Promise;
var MongooseConnectService = (function (_super) {
    __extends(MongooseConnectService, _super);
    function MongooseConnectService(host, dbName) {
        _super.call(this);
        this.host = host;
        this.dbName = dbName;
        this.db = null;
        process.on('exit', function () {
            Mongoose.disconnect();
        });
    }
    /**
     *
     */
    MongooseConnectService.prototype.connect = function () {
        var _this = this;
        if (this.db === null) {
            console.log('Mongoose attempt to connect to ' + 'mongodb://' + this.host + '/' + this.dbName);
            this.db = Mongoose.connect('mongodb://' + this.host + '/' + this.dbName, function (err) {
                if (err) {
                    _this.emit('error', 'Fail to connect to ' + 'mongodb://' + _this.host + '/' + _this.dbName);
                }
                else {
                    _this.emit("connect", _this.db);
                }
            });
        }
        else {
            this.emit("connect", this.db);
        }
        return this;
    };
    /**
     *
     * @returns {function(any, any, any): undefined}
     */
    MongooseConnectService.prototype.middleware = function () {
        var _this = this;
        return function (request, response, next) {
            request.db = _this.db;
            next();
        };
    };
    return MongooseConnectService;
}(events_1.EventEmitter));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MongooseConnectService;
//# sourceMappingURL=MongooseConnectService.js.map