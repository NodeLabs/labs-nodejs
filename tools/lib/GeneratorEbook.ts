import {GeneratorBase} from './GeneratorBase';
import {MDUtils} from './MDUtils';
import FileUtils from './FileUtils';
import {IFileContent} from './interfaces/interfaces';
import {$log} from 'ts-log-debug';


export class GeneratorEbook extends GeneratorBase {

    constructor(private dir: string, settings) {
        super(settings);
    }
    /**
     *
     * @param filesContents
     */
    generate(filesContents: IFileContent[]): Promise<any> {

        $log.debug('Task generate Ebook');

        let promises = [];

        let ebookContent = filesContents
            .map((fileContent: IFileContent) => {

                let content = MDUtils.toTagID(fileContent.title) + "\n";

                return content + MDUtils.markdownToHTML(
                        fileContent.content
                            .split('\n')
                            .map(line => line.replace(/\[Suivant\]\((.*)\)/gi, ''))
                            .join('\n')
                    );

            }).join('\n');

        const promise = this
            .render('page', {
                pageTitle: `${this.settings.pageTitle}`,
                body: this.replaceUrl(
                    ebookContent,
                    filesContents,
                    f => '#' + MDUtils.sanitize(f.title)
                )
            })
            .then(content => FileUtils.write(`${this.dir}/index.html`, content));


        promises.push(promise);

        promises.concat(this.copyAssets(this.dir));

        return Promise.all(promises);
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

        const rules = filesContents
            .map(fileContent => ({
                from: base + fileContent.path.replace(root + '/', ''),
                to: cb(fileContent)
            }));

        rules.push({
            from: base,
            to: ''
        });

        rules.forEach(rule => content = content.replace(new RegExp(rule.from, 'gi'), rule.to));

        return content;
    }

}