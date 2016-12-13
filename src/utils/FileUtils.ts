let path = require('path'),
    appDir = path.resolve('./');

import * as Fs from "fs";
import {EventEmitter} from "events";

export interface IFileCallbackSuccess {
    (content: string): void
}

export class FileUtils extends EventEmitter {

    private fileName: string;
    private _stats;
    private _fd;

    constructor(fileName: string) {
        super();
        this.fileName = path.resolve(`${appDir}/resources/${fileName}`);
    }

    public getFileName = () => this.fileName;
    /**
     *
     * @returns {Promise<string>}
     */
    read(resolve?: IFileCallbackSuccess) {

        const onError = (err) => this.emit('error', err);
        const onSuccess = (content) => {
            if (resolve){
                resolve(content);
            }
            this.emit("success", content);
        };

        this.stats(() => {
            this.open("r", () => {
                this.readFile(onSuccess, onError);
            }, onError);
        }, onError);

    }


    /**
     *
     * @returns {Promise<Fs.Stats>}
     */
    private stats(resolve: (stats: Fs.Stats) => void, reject = new Function): void {

        Fs.stat(this.fileName, (err, stats) => {

            if(err) {
                reject(err);
                return;
            }

            this._stats = stats;

            resolve(stats);
        });
    }

    /**
     *
     * @param flags
     * @param resolve
     * @param reject
     * @returns {Promise<number>}
     */
    private open(flags: string = "r", resolve = new Function, reject = new Function): void {

        Fs.open(this.fileName, flags, (err, fd) => {

            if(err) {
                reject(err);
                return;
            }
            this._fd = fd;
            resolve(fd);
        });
    }

    /**
     *
     * @returns {Promise<string>}
     * @param resolve
     * @param reject
     */
    private readFile(resolve: (content: string) => void, reject = new Function): void {

        let buffer = new Buffer(this._stats.size);

        Fs.read(this._fd, buffer, 0, buffer.length, null, (err, bytesRead, buffer) => {

            if(err) {
                reject(err);
                return;
            }

            const data = buffer.toString("utf8", 0, buffer.length);

            Fs.close(this._fd);

            resolve(data);

        });


    }
}
