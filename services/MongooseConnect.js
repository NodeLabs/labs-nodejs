"use strict";
const Mongoose = require('mongoose');
const events_1 = require("events");
Mongoose.Promise = require('bluebird');
class MongooseConnect extends events_1.EventEmitter {
    constructor(host, dbName) {
        super();
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
    connect() {
        if (this.db === null) {
            var self = this;
            console.log('Mongoose attempt to connect to ' + 'mongodb://' + this.host + '/' + this.dbName);
            this.db = Mongoose.connect('mongodb://' + this.host + '/' + this.dbName, (err) => {
                if (err) {
                    this.emit('error', 'Fail to connect to ' + 'mongodb://' + this.host + '/' + this.dbName);
                }
                else {
                    this.emit("connect", this.db);
                }
            });
        }
        else {
            this.emit("connect", this.db);
        }
        return this;
    }
    /**
     *
     * @returns {function(any, any, any): undefined}
     */
    middleware() {
        return (request, response, next) => {
            request.db = this.db;
            next();
        };
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MongooseConnect;
//# sourceMappingURL=MongooseConnect.js.map