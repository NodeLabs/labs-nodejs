"use strict";
require('source-map-support').install();
var Generator_1 = require('./lib/Generator');
var ts_log_debug_1 = require('ts-log-debug');
var path = require('path');
var baseDir = path.resolve('../');
/**
 *
 * @type {{root: Promise.<string>, pageTitle: string, repository: string, dirs: [*], files: Array, outDirHtml: [*]}}
 */
var settings = require('../generator.json');
settings.root = baseDir;
settings.cwd = baseDir + "/dist";
settings.copy = settings.copy.map(function (rule) {
    rule.from = rule.from.replace('${baseDir}', baseDir);
    return rule;
});
/**
 *
 */
new Generator_1.Generator(settings)
    .build()
    .then(function (settings) { return ts_log_debug_1.$log.debug('Done.'); })
    .catch(function (err) { return ts_log_debug_1.$log.error(err); });
//# sourceMappingURL=index.js.map