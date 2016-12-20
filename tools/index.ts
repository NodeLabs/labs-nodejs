"use strict";
require('source-map-support').install();

import {Generator, IGeneratorSettings} from './lib/Generator';

const path = require('path');
const baseDir = path.resolve('../');

/**
 *
 * @type {{root: Promise.<string>, pageTitle: string, repository: string, dirs: [*], files: Array, outDirHtml: [*]}}
 */
const settings: IGeneratorSettings = {
    root: baseDir,
    pageTitle: 'TP Node.js',
    repository: "https://github.com/Romakita/tp-nodejs/blob/master/",

    cwd: `${baseDir}/dist`,

    copy: [
        {from: `${baseDir}/src`, to: 'src'}
    ],
    concat: {
        outDir: [
            {format: 'html',  path:`Instructor/html`},
            {format: 'html',  path:`Student/html`},
        ],
        files: [
            {title: '', path: 'readme.md'},
            {title: 'TP1 - Installation', path: 'tp1-installation.md'},
            {title: 'TP2 - Manipulation des fichiers', path: 'tp2-fs.md'},
            {title: 'TP3 - Express', path: 'tp3-express.md'},
            {title: 'TP4 - Templating avec EJS', path: 'tp4-express-ejs.md'},
            {title: 'TP5 - Middlewares, Formulaire & Services', path: 'tp5-express-middlewares-form-services.md'},
            {title: 'TP6 - Socket.io', path: 'tp6-socketio.md'},
            {title: 'TP7 - Les promises', path: 'tp7-promise.md'},
            {title: 'TP8 - Base de données', path: 'tp8-mongoose.md'},
            {title: 'TP9 - Test unitaires', path: 'tp9-test-unitaires.md'},
            {title: 'Aide - importation des modules', path: 'aide-importation-module.md'}
        ]
    }
};

/**
 *
 */
new Generator(settings)
    .build()
    .then(settings => console.log('Finish =>', settings))
    .catch(err => console.error(err));

