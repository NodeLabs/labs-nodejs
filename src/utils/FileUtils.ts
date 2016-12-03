let path = require('path'),
    appDir = path.resolve('./');

import * as Fs from "fs";
import {EventEmitter} from "events";

export class FileUtils extends EventEmitter {

    private fileName: string;

    constructor(fileName: string) {
        super();
        this.fileName = path.resolve(`${appDir}/resources/${fileName}`);
    }

    public getFileName = () => this.fileName;
    /**
     *
     * @returns {Promise<string>}
     */
    read(): Promise<string> {

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
            })
            .then((content: string) =>{
                this.emit('success', content);
                return content;
            })
            .catch((err) => {
                this.emit('error', err);
                return Promise.reject(err);
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
                    reject(new Error('File not found'));
                }
            });
        });
    }

    /**
     *
     * @returns {Promise<Fs.Stats>}
     */
    private stats(): Promise<Fs.Stats> {

        return new Promise<Fs.Stats>((resolve: any, reject: any) => {

            Fs.stat(this.fileName, (err, stats) => {

                if(err) {
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
    private open(flags: string = "r"): Promise<number> {
        return new Promise<number>((resolve, reject) => {

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
     * @returns {Promise<string>}
     */
    private readFile(fd: number, stats: Fs.Stats): Promise<string> {

        return new Promise<string>((resolve, reject: Function) => {

            let buffer = new Buffer(stats.size);

            Fs.read(fd, buffer, 0, buffer.length, null, (err, bytesRead, buffer) => {

                if(err) {
                    reject(err);
                    return;
                }

                const data = buffer.toString("utf8", 0, buffer.length);

                Fs.close(fd);

                resolve(data);

            });

        });

    }
}
