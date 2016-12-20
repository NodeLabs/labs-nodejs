"use strict";

const mkdir = require('./lib/mkdir');
const mdToHtml = require('./lib/markdown-to-html');
const getMdFiles = require('./lib/get-md-files');
const path = require('path');
const baseDir = path.resolve('../');
const writeFile = require('./lib/write-file');
const replace =  require('./lib/replace');
const render = require('./lib/render');
const copyFile = require('./lib/copy-file');

/**
 *
 * @type {{root: Promise.<string>, pageTitle: string, repository: string, dirs: [*], files: Array, outDirHtml: [*]}}
 */
const settings = {
    root: baseDir,
    pageTitle: 'TP Node.js',
    repository: "https://github.com/Romakita/tp-nodejs/blob/master/",
    dirs:[
        `${baseDir}/dist`,
        `${baseDir}/dist/Instructor`,
        `${baseDir}/dist/Instructor/html`,
        `${baseDir}/dist/Instructor/html/style`,
        `${baseDir}/dist/Student`,
        `${baseDir}/dist/Student/html`,
        `${baseDir}/dist/Instructor/html/style`,
        `${baseDir}/dist/Printer`
    ],
    files: [],
    outDirHtml: [
        `${baseDir}/dist/Instructor/html`,
        `${baseDir}/dist/Student/html`
    ]
}

// build directories
mkdir(settings.dirs);

let filesMd;

// get markdown list
getMdFiles(baseDir)
    .then((files) => {

        settings.files = files;

        console.log('Files found =>', files);

        return Promise.all(
            settings.files.map(file => mdToHtml(file))
        );
    })
    .then((htmlContents) => {

        return Promise.all(
            htmlContents
                .map(html => replace(html, settings))
                .map((html, index) => render('page', {
                    pageTitle: `${settings.pageTitle} - ${settings.files[index]}`,
                    body: html
                }))
        );
    })
    .then(htmlRendered => {

        const promises = [];

        settings.outDirHtml.map(dir => {

            const p = htmlRendered.map((content, index) => {

                const file = settings.files[index].replace(baseDir, '').replace('.md', '.html');

                return writeFile(`${dir}/${file}`, content);

            });

            console.log(`${baseDir}/tools/node_modules/github-markdown-css/github-markdown.css`);

            copyFile(`${baseDir}/tools/node_modules/github-markdown-css/github-markdown.css`, `${dir}/style/github-markdown.css`, () => {});

            promises.concat(p);
        });


        return Promise.all(promises);

    })
    .catch(err =>  {
        console.error(err);
    })





