"use strict";
require('source-map-support').install();

import {Generator} from './lib/Generator';
import {IGeneratorSettings} from './lib/interfaces/interfaces';
import {$log} from 'ts-log-debug';

const path = require('path');
const baseDir = path.resolve('../');

/**
 *
 * @type {{root: Promise.<string>, pageTitle: string, repository: string, dirs: [*], files: Array, outDirHtml: [*]}}
 */
const settings: IGeneratorSettings = require('../generator.json');
settings.root = baseDir;
settings.cwd = `${baseDir}/dist`;
settings.copy = settings.copy.map(rule => {
    rule.from = rule.from.replace('${baseDir}', baseDir);
    return rule;
});

/**
 *
 */
new Generator(settings)
    .build()
    .then(settings => $log.debug('Done.'))
    .catch(err => $log.error(err));

