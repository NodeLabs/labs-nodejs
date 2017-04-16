"use strict";
import {Generator} from "ts-md-docs";

import {$log} from "ts-log-debug";

/**
 *
 * @type {{root: Promise.<string>, pageTitle: string, repository: string, dirs: [*], files: Array, outDirHtml: [*]}}
 */
const settings = require("./generator.json");
settings.root = __dirname;
/**
 *
 */
new Generator(settings)
    .build()
    .then(settings => $log.debug('Done.'))
    .catch(err => console.error(err));

