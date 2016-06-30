let path = require('path'),
    appDir = path.resolve('./');

import * as Fs from "fs";
import {EventEmitter} from "events";

import * as Promise from "bluebird";

export class File extends EventEmitter {

    private fileName: string;

    constructor(fileName: string) {
        super();
        this.fileName = path.resolve(`${appDir}/public/${fileName}`);
    }

    /**
     *
     * @param callback
     * @param error
     */
    read(): Promise<any> {

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
    private exists(): Promise<any> {

        return new Promise<any>((resolve: any, reject: any) => {
            Fs.exists(this.fileName, (exists) => {

                if (exists) {
                    resolve();
                } else {
                    reject(false);
                }
            });
        });
    }

    /**
     *
     * @returns {Promise<T>|Promise}
     */
    private stats() {
        return new Promise((reject, resolve) => {

            Fs.stat(this.fileName, (err, stats) => {

                if(err) {
                    resolve(err);
                    return;
                }

                resolve(stats);
            });
        });
    }

    /**
     *
     * @returns {PromiseConstructor|Promise}
     */
    private open(flags = "r"): Promise<any> {
        return new Promise((resolve, reject) => {

            Fs.open(this.fileName, flags, (err, fd) => {

                if(err) {
                    reject(err);
                    return;
                }

                resolve(fd);
            });
        })
    }

    /**
     *
     * @param fd
     * @param stats
     * @returns {Promise<T>|Promise}
     */
    private readFile(fd, stats) {

        return new Promise((resolve, reject: Function) => {

            let buffer = new Buffer(stats.size);

            Fs.read(fd, buffer, 0, buffer.length, null, (err, bytesRead, buffer) => {

                if(err) {
                    reject(err);
                    return;
                }

                var data = buffer.toString("utf8", 0, buffer.length);

                Fs.close(fd);

                resolve(data);
                //resolve(data);
            });

        });

    }
}
