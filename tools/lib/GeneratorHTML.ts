import {GeneratorBase} from './GeneratorBase';
import {MDUtils} from './MDUtils';
import FileUtils from './FileUtils';
import {IFileContent} from './interfaces/interfaces';
import {$log} from 'ts-log-debug';


export class GeneratorHTML extends GeneratorBase {


    constructor(private dir: string, settings) {
        super(settings);
    }
    /**
     *
     * @param filesContents
     */
    generate(filesContents: IFileContent[]): Promise<any> {

        $log.debug('Task generate HTML');

        const promises = filesContents
            .map((fileContent: IFileContent) => {

                const file = fileContent.path.replace('.md', '.html');

                const content = this.replaceUrl(
                    MDUtils.markdownToHTML(fileContent.content),
                    filesContents,
                    f => f.path.replace('.md', '.html')
                );

                return this
                    .render('page', {
                        pageTitle: `${this.settings.pageTitle}`,
                        body: content
                    })
                    .then(content => FileUtils.write(`${this.dir}/${file}`, content));

            });

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