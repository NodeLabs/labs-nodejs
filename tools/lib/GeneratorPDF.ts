import {GeneratorBase} from './GeneratorBase';
import {MDUtils} from './MDUtils';
import {IFileContent} from './interfaces/interfaces';

import * as Express from 'express';
import serveStatic = require('serve-static');
import {$log} from 'ts-log-debug';

const htmlPDF = require('html-pdf');

export class GeneratorPDF extends GeneratorBase {
    /**
     *
     */
    private app;

    private pdfSettings = {
        format:'A4',
        type: 'pdf',
        base: 'http://localhost:9090/',
        "border": {
            "top": "1cm",            // default is 0, units: mm, cm, in, px
            "right": "1cm",
            "bottom": "1cm",
            "left": "1cm"
        }
    };

    constructor(private dir: string, settings) {
        super(settings);
    }

    /**
     *
     * @returns {Promise<T>}
     */
    private startServer() {

        return new Promise((resolve) => {
            this.app = Express()
                .use(serveStatic(this.dir))
                .listen(9090, resolve);
        });
    }
    /**
     *
     * @param filesContents
     */
    generate(filesContents: IFileContent[]): Promise<any> {

        $log.debug('Task generate PDF');

        return this
            .startServer()
            .then(() => this.copyAssets(this.dir))
            .then(() => this.generateHTML(filesContents))
            .then((filesContents: any) => this.generatePDF(filesContents))
            .then(() => this.app.close())

    }

    /**
     *
     * @param filesContents
     * @returns {Promise<TResult>[]}
     */
    private generateHTML(filesContents: IFileContent[]): Promise<IFileContent[]> {

        const promises = filesContents

            .map((fileContent: IFileContent) => {

                let content = MDUtils.toTagID(fileContent.title)
                    + "\n"
                    + MDUtils.markdownToHTML(this.filter(fileContent.content));

                content = this.replaceUrl(
                    content,
                    filesContents,
                    f => '#' + MDUtils.sanitize(f.title)
                );

                return Object.assign(fileContent, {
                    content
                });

            });

        return Promise.all(promises);
    }

    protected render(content: string): Promise<string> {

        return super.render('pdf', {
            pageTitle: `${this.settings.pageTitle}`,
            body: content,
        })
    }

    /**
     *
     * @param content
     */
    private filter = (content) => content
        .split('\n')
        .map(line => line.replace(/\[Suivant\]\((.*)\)/gi, ''))
        .join('\n');

    /**
     *
     * @returns {Promise<IFileContent[]>}
     */
    private generatePDF(filesContents: IFileContent[]) {

        return this.render(filesContents.map(f => f.content).join('\n'))
            .then(contentHTML => {

                return new Promise((resolve, reject) => {
                    htmlPDF
                        .create(contentHTML, this.pdfSettings)
                        .toFile(this.dir + '/' + this.settings.pdfName, (err, res) => {
                            if (err) return reject(err);
                            resolve(res);
                        });
                });

            });


    }

    /**
     *
     * @param content
     * @param filesContents
     * @param cb
     * @returns {string}
     */
    private replaceUrl(content: string, filesContents: IFileContent[], cb: Function = c => c): string {
        const { root, repository, branch} = this.settings;

        const base = repository + 'blob/' + branch + '/';

        let rules = filesContents
            .map(fileContent => ({
                from: base + fileContent.path.replace(root + '/', ''),
                to: cb(fileContent)
            }));

        let rulesResources = this.settings.checkout.branchs
            .map(branch => ({
                from: repository + 'tree/' + branch,
                to: this.settings.checkout.cwd +'/'+ branch + '.zip'
            }));

        rules = rules.concat(rulesResources);

        rules.push({
            from: base,
            to: ''
        });

        return this.replacer(content, rules);
    }

}