
import FileUtils from './FileUtils';
import {IGeneratorSettings, IFormatOutput, IFileContent, IFile} from './interfaces/interfaces';
import {GeneratorHTML} from './GeneratorHTML';
import {GeneratorEbook} from './GeneratorEbook';
import {GeneratorPDF} from './GeneratorPDF';
import {$log} from "ts-log-debug";

export class Generator {
    /**
     *
     */
    private tmpDir: string;
    /**
     *
     */
    private pdfDir: string;
    /**
     *
     */
    private ebookDir: string;
    /**
     *
     */
    private htmlDir: string;

    private resourcesDir: string;
    /**
     *
     * @type {Map<string, Promise<string>>}
     */
    constructor(private settings: IGeneratorSettings) {
        this.tmpDir = `${this.settings.cwd}/.tmp`;
        this.pdfDir = `${this.tmpDir}/pdf`;
        this.ebookDir = `${this.tmpDir}/ebook`;
        this.htmlDir = `${this.tmpDir}/html`;
        this.resourcesDir = `${this.tmpDir}/resources`;
    }

    /**
     *
     * @returns {Promise<TResult|any[]>}
     */
    public build(){
        return this.createWorkspace()
            .then(() => this.taskCheckout())
            .then(() => this.taskReadFiles())
            .then(filesContents => this.taskGenerate(filesContents))
            .then(() => this.taskCopyToDirs())
            .then(() => this.settings)
            .then(() => FileUtils.remove(this.tmpDir));
    }

    /**
     *
     * @returns {Promise<void>}
     */
    private createWorkspace(){
        return Promise.resolve()
            .then(() => FileUtils.remove(this.settings.cwd))
            .then(() => FileUtils.mkdirs(this.settings.cwd))
            .then(() => FileUtils.mkdirs(this.tmpDir))
            .then(() => FileUtils.mkdirs(this.pdfDir))
            .then(() => FileUtils.mkdirs(this.htmlDir))
            .then(() => FileUtils.mkdirs(this.ebookDir))
            .then(() => FileUtils.mkdirs(this.resourcesDir));
    }


    /**
     *
     * @returns {Promise<string[]>}
     */
    private taskReadFiles(): Promise<IFileContent[]> {

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
     * @returns {Promise<TAll[]>}
     */
    private taskGenerate(filesContents: IFileContent[]): Promise<any> {

        const generatorHTML = new GeneratorHTML(this.htmlDir, this.settings);
        const generatorEbook = new GeneratorEbook(this.ebookDir, this.settings);
        const generatorPDF = new GeneratorPDF(this.pdfDir, this.settings);

        return Promise.resolve()
            .then(() => generatorHTML.generate(filesContents))
            .then(() => generatorEbook.generate(filesContents))
            .then(() => generatorPDF.generate(filesContents));
    }

    /**
     *
     */
    private taskCheckout() {

        if(this.settings.checkout) {

            $log.debug('Checkout all files...')
            return Promise.all(this.settings
                .checkout
                .branchs
                .map((branch: string) => {

                    return FileUtils.downloadFile(
                        `${this.settings.repository}archive/${branch}.zip`,
                        `${this.resourcesDir}/${branch}.zip`
                    );

                }));

        }

    }
    /**
     *
     */
    private taskCopyToDirs() {

        $log.debug('Generate directories');

        const promises = this.settings.outDir.map((task: IFormatOutput) => {
            const path = this.settings.cwd + '/' + task.path;

            return FileUtils
                .mkdirs(path)
                .then(() => {

                    $log.debug(`Export ${task.format} to directory ${path}`);

                    switch(task.format) {
                        case "html":
                            return FileUtils
                                .copy(this.htmlDir, path)
                                .then(() =>
                                    FileUtils.copy(
                                        this.resourcesDir,
                                        `${this.htmlDir}/${this.settings.checkout.cwd}`
                                    ).catch(() => true)
                                );
                        case "ebook":
                            return FileUtils
                                .copy(this.ebookDir, path)
                                .then(() =>
                                    FileUtils.copy(
                                        this.resourcesDir,
                                        `${this.htmlDir}/${this.settings.checkout.cwd}`
                                    ).catch(() => true)
                                );
                        case "pdf":
                            return FileUtils
                                .copy(this.pdfDir + '/' + this.settings.pdfName, path + '/' + this.settings.pdfName)
                                .then(() =>
                                    FileUtils.copy(
                                        this.resourcesDir,
                                        `${this.htmlDir}/${this.settings.checkout.cwd}`
                                    ).catch(() => true)
                                );
                    }

                    return Promise.resolve();
                });

        });

        return Promise.all(promises);
    }


}