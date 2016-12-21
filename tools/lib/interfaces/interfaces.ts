
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
    format: 'html'|'pdf'|'ebook';
    path: string;
}

export interface IRule {
    from: string;
    to: string;
}

export interface IGeneratorSettings {
    root: string;
    cwd: string;
    pageTitle: string;
    repository: string;
    branch: string;
    files?: string[];
    rules?: IRule[];
    renderedContents?: string[];
    copy: IRule[];
    outDir: IFormatOutput[];
    pdfName: string;
    concat: {
        files: IFile[];
    },
    checkout?: {
        cwd: string;
        branchs: string[];
    }
}
