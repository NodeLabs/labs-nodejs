const readFile = require('./read-file');
const ejs = require('ejs');
const path = require('path');
const basePath = path.resolve('./models');

const cacheMap = new Map();

module.exports = function(file, scope) {

    let promise;

    if (cacheMap.has(file)) {
        promise = cacheMap.get(file);
    } else {
        promise = readFile(`${basePath}/${file}.html`);
        cacheMap.set(file, promise);
    }

    return promise.then(template => ejs.render(template, scope));
};