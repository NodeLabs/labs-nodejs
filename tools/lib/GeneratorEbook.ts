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
        let menu = [];

        let ebookContent = filesContents
            .map((fileContent: IFileContent) => {

                let content = MDUtils.toTagID(fileContent.title) + "\n";

                menu.push({
                    title: fileContent.title,
                    href: '#' + MDUtils.sanitize(fileContent.title)
                });

                return content + MDUtils.markdownToHTML(
                        fileContent.content
                            .split('\n')
                            .map(line => line.replace(/\[Suivant\]\((.*)\)/gi, ''))
                            .join('\n')
                    );

            }).join('\n');

        let promise = this
            .render('page', {
                pageTitle: `${this.settings.pageTitle}`,
                body: this.replaceUrl(
                    ebookContent,
                    filesContents
                ),
                menu: menu
            })
            .then(content => FileUtils.write(`${this.dir}/index.html`, content));


        promises.push(promise);

        promises = promises.concat(this.copyAssets(this.dir));

        return Promise.all(promises);
    }

    /**
     *
     * @param content
     * @param filesContents
     * @param cb
     * @returns {string}
     */
    private replaceUrl(content: string, filesContents: IFileContent[]): string {
        const { root, repository, branch} = this.settings;

        const base = repository + 'blob/' + branch + '/';

        let rules = filesContents
            .map(fileContent => ({
                from: base + fileContent.path.replace(root + '/', ''),
                to: '#' + MDUtils.sanitize(fileContent.title)
            }));

        const rulesResources = this.settings.checkout.branchs
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