
import FileUtils from './FileUtils';
import {tmpdir} from 'os';

const remark = require('remark');
const merge = require('deepmerge');
const remarkHtml = require('remark-html');
const sanitizeGithub = require('hast-util-sanitize/lib/github');
const ejs = require('ejs');
const path = require('path');
const basePath = path.resolve('./models');

export interface IFileContent {
    title: string;
    path: string;
    content: string;
}
export interface IFile {
    title: string,
    path: string
}

export interface IFormatOutput {
    format: 'html',
    path: string
}

export interface IRule {
    from: string,
    to: string
}

export interface IGeneratorSettings {
    root: string;
    cwd: string;
    pageTitle: string;
    repository: string;
    files?: string[];
    rules?: IRule[];
    renderedContents?: string[];
    copy: IRule[],
    concat: {
        outDir: IFormatOutput[];
        files: IFile[];
    }
}

export class Generator {
    private tmpDir: string;
    private cache: Map<string, Promise<string>> = new Map<string, Promise<string>>();

    constructor(private settings: IGeneratorSettings) {
        this.tmpDir = `${this.settings.cwd}/.tmp`;
    }

    /**
     *
     * @returns {Promise<TResult|any[]>}
     */
    public build(){
        return Promise.resolve()
            .then(() => FileUtils.remove(this.settings.cwd))
            .then(() => FileUtils.mkdirs(this.settings.cwd))
            .then(() => FileUtils.mkdirs(this.tmpDir))
            .then(() => FileUtils.mkdirs(this.tmpDir+'/ebook'))
            .then(() => FileUtils.mkdirs(this.tmpDir+'/html'))
            .then(() => FileUtils.mkdirs(this.tmpDir+'/pdf'))
            .then(() => this.taskMDToHTML())
            .then(filesContents => this.taskGenerate(filesContents))
            .then(() => this.settings);
    }
    /**
     *
     * @returns {Promise<string[]>}
     */
    private taskMDToHTML(): Promise<IFileContent[]> {

        const mapper: any = (file: IFile) =>
            FileUtils
                .read(this.settings.root + '/' + file.path)
                .then(content => (<IFileContent> {
                    title: file.title,
                    path: file.path,
                    content
                }));


        const promises = this.settings.concat.files.map(mapper);

        return Promise.all(promises);
    }

    /**
     *
     * @param contents
     * @returns {Promise<TAll[]>}
     */
    /* private taskRender(contents: IFileContent[]): Promise<string[]>{

     return Promise.all(
     contents
     .map(html => this.replaceUrl(html))
     .map((html, index) => this.render('page', {
     pageTitle: `${this.settings.pageTitle} - ${this.settings.files[index]}`,
     body: html
     }))
     )
     .then(renderedContents => this.settings.renderedContents = renderedContents);
     }*/

    /**
     *
     * @returns {Promise<TAll[]>}
     */
    private taskGenerate(filesContents: IFileContent[]): Promise<any> {

        const pdfDir = `${this.settings.cwd}/.tmp/pdf`;
        const ebookDir = `${this.settings.cwd}/.tmp/ebook`;
        const htmlDir = `${this.settings.cwd}/.tmp/html`;

        // GENERATE WEBSITE
        const promises = filesContents.map((fileContent: IFileContent) => {

            const file = fileContent.path.replace('.md', '.html');

            return this
                .render('page', {
                    pageTitle: `${this.settings.pageTitle}`,
                    body: this.replaceUrl(
                        Generator.markdownToHTML(fileContent.content),
                        filesContents,
                        f => f.path.replace('.md', '.html')
                    )
                })
                .then(content => FileUtils.write(`${htmlDir}/${file}`, content));

        });

        promises.concat(this.copyAssets(htmlDir));

        // GENERATE EBOOK

        let ebookContent = filesContents
            .map((fileContent: IFileContent) => {

                let content = this.toTagID(fileContent.title) + "\n";

                return content + Generator.markdownToHTML(
                        fileContent.content
                            .split('\n')
                            .map(line => line.replace(/\[Suivant\]\((.*)\)/gi, ''))
                            .join('\n')
                    );

            }).join('\n');

        let p = this
            .render('page', {
                pageTitle: `${this.settings.pageTitle}`,
                body: this.replaceUrl(
                    ebookContent,
                    filesContents,
                    f => '#' + Generator.sanitize(f.title)
                )
            })
            .then(content => FileUtils.write(`${ebookDir}/index.html`, content));


        promises.push(p);

        promises.concat(this.copyAssets(ebookDir));

        // GENERATE PDF

        /*this.settings.outDirHtml.map(dir => {

         const p = renderedContents.map((content, index) => {

         const file = this.settings.files[index].replace(this.settings.root, '').replace('.md', '.html');

         return FileUtils.write(`${dir}/${file}`, content);

         });



         promises.concat(p);
         });*/


        return Promise.all(promises);
    }

    /**
     *
     * @param s
     * @returns {string}
     */
    private static sanitize(s: string): string {
        let r = s.toLowerCase();
        r = r.replace(new RegExp(/\s/g),"");
        r = r.replace(new RegExp(/[àáâãäå]/g),"a");
        r = r.replace(new RegExp(/æ/g),"ae");
        r = r.replace(new RegExp(/ç/g),"c");
        r = r.replace(new RegExp(/[èéêë]/g),"e");
        r = r.replace(new RegExp(/[ìíîï]/g),"i");
        r = r.replace(new RegExp(/ñ/g),"n");
        r = r.replace(new RegExp(/[òóôõö]/g),"o");
        r = r.replace(new RegExp(/œ/g),"oe");
        r = r.replace(new RegExp(/[ùúûü]/g),"u");
        r = r.replace(new RegExp(/[ýÿ]/g),"y");
        r = r.replace(new RegExp(/\W/g),"");

        return r
            .replace('.md', '')
            .replace('&', '')
            .replace(/-/gi, '')
            .replace(/ /gi,'-');
    }

    private toTagID = (str: string) => `<div id="${Generator.sanitize(str)}"></div>`;
    private toHash = (str: string) => `<a href="#${Generator.sanitize(str)}"></a>`;

    /**
     *
     * @returns {Promise<TResult>}
     * @param content
     */
    private static markdownToHTML(content): string {
        return remark().use(remarkHtml, {
            sanitize: merge(sanitizeGithub, {
                attributes: {
                    '*': ['className']
                }
            })
        }).process(content).toString();
    }

    /**
     *
     * @returns {any}
     */
    private replaceUrl(content: string, filesContents: IFileContent[], cb: Function = c => c): string {
        const { root, repository} = this.settings;

        const rules = filesContents
            .map(fileContent => ({
                from: repository + fileContent.path.replace(root + '/', ''),
                to: cb(fileContent)
            }));

        rules.push({
            from: repository,
            to: ''
        });

        rules.forEach(rule => content = content.replace(new RegExp(rule.from, 'gi'), rule.to));

        return content;
    }
    /**
     *
     * @param file
     * @param scope
     * @returns {Promise<TResult>|PromiseLike<TResult>|Promise<T>|Promise<TResult2|TResult1>}
     */
    private render(file: string, scope: any): Promise<string> {

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
    private copyAssets(cwd: string){
        const promises = [];

        promises.push(
            FileUtils.copy(
                `${this.settings.root}/tools/node_modules/github-markdown-css/github-markdown.css`,
                `${cwd}/style/github-markdown.css`
            )
        );

        promises.concat(
            this.settings.copy.map((file: IRule) => FileUtils.copy(file.from, `${cwd}/${file.to}`))
        );

        return promises;
    }
}