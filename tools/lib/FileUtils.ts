import * as request from "request";
const walk    = require('walk');
import * as FsExtra from "fs-extra"
import {$log} from 'ts-log-debug';

export default class FileUtils {

    private static nodeify = (resolve, reject): any => {
        return (err, result) => {
            if (err) return reject(err);

            resolve(result);
        }
    };

    /**
     *
     * @param path
     */
    static read = (path: string): Promise<string> =>

        new Promise((resolve, reject) =>

            FsExtra.readFile(path, FileUtils.nodeify(resolve, reject))

        )
            .then(content => content.toString());
    /**
     *
     * @param path
     * @param content
     */
    static write = (path: string, content: string): Promise<any> =>

        new Promise((resolve, reject) =>

            FsExtra.writeFile(path, content, FileUtils.nodeify(resolve, reject))

        );

    /**
     *
     * @param from
     * @param to
     */
    static copy = (from: string, to: string): Promise<any> =>

        new Promise((resolve, reject) =>
            FsExtra.copy(from, to, FileUtils.nodeify(resolve, reject))
        );


    /**
     *
     * @param path
     */
    static remove = (path: string): Promise<any> =>

        new Promise((resolve, reject) =>
            FsExtra.remove(path, FileUtils.nodeify(resolve, reject))
        );

    /**
     *
     * @param path
     * @returns {Promise<string[]>}
     */
    static mkdirs(path: string | string[]): Promise<any> {

        const paths: string[] = typeof path === "string" ? [path] : <string[]>path;

        const promises = paths.map(path =>

            new Promise((resolve, reject) => FsExtra.mkdirs(path, this.nodeify(resolve, reject)))

        );

        return Promise.all(promises);
    }

    /**
     *
     * @returns {Promise<T>}
     */
    static list(path: string, pattern: RegExp = /\.md$/): Promise<string[]> {

        return new Promise((resolve, reject) => {

            const files   = [];
            const walker  = walk.walk(path, {
                followLinks: false,
                filters: ["node_modules"]
            });

            walker.on('file', (root, stat, next) => {

                // Add this file to the list of files
                if (stat.name.match(pattern)) {
                    files.push(root + '/' + stat.name);
                }

                next();
            });

            walker.on('end', () => {
                resolve(files);
            });

        });
    }

    /**
     *
     * @param url
     * @param to
     * @returns {Promise<T>}
     */
    static downloadFile(url: string, to: string) {

        return new Promise((resolve, reject) => {

            $log.debug('checkout', url);

            request(url)
                .pipe(FsExtra.createWriteStream(to))
                .on('close', resolve)
                .on('error', reject);

        })
            .then(() => {
                $log.debug('checkout done', url);
            });

    }

}