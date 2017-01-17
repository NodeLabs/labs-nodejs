
import {IRule, IFileContent, IGeneratorSettings} from './interfaces/interfaces';
const path = require('path');
const basePath = path.resolve('./models');

import FileUtils from './FileUtils';
import {$log} from 'ts-log-debug';

const ejs = require('ejs');

export abstract class GeneratorBase {
    /**
     *
     * @type {Map<string, Promise<string>>}
     */
    private cache: Map<string, Promise<string>> = new Map<string, Promise<string>>();

    constructor(protected settings: IGeneratorSettings){

    }

    /**
     *
     * @param filesContents
     */
    abstract generate(filesContents: IFileContent[]): Promise<any>;

    /**
     *
     * @param file
     * @param scope
     * @returns {PromiseLike<TResult>|Promise<TResult>|Promise<T>|Promise<TResult2|TResult1>}
     */
    protected render(file: string, scope: any): Promise<string> {

        let promise;

        if (this.cache.has(file)) {
            promise = this.cache.get(file);
        } else {
            promise = FileUtils.read(`${basePath}/${file}.html`);
            this.cache.set(file, promise);
        }

        return promise.then(template => ejs.render(template, scope));

    }

    /**
     *
     * @param cwd
     * @returns {Array}
     */
    protected copyAssets(cwd: string) {

        $log.debug('copy assets to', cwd);

        let promises = [];

        promises.push(
            FileUtils.copy(
                `${basePath}/scripts/`,
                `${cwd}/scripts`
            )
        );

        promises.push(
            FileUtils.copy(
                `${basePath}/styles/`,
                `${cwd}/styles`
            )
        );

        promises.push(
            FileUtils.copy(
                `${basePath}/fonts/`,
                `${cwd}/fonts`
            )
        );

        promises = promises.concat(
            this.settings.copy.map((file: IRule) => FileUtils.copy(file.from, `${cwd}/${file.to}`))
        );

        return promises;
    }

    protected replacer(content, rules) {
        rules.forEach(rule => content = content.replace(new RegExp(rule.from, 'gi'), rule.to));
        return content;
    }
}