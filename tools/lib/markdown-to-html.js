const readFile = require('./read-file');

const remark = require('remark');
const merge = require('deepmerge');
const remarkHtml = require('remark-html');
const sanitizeGithub = require('hast-util-sanitize/lib/github');

function process(content){
    return remark().use(remarkHtml, {
        sanitize: merge(sanitizeGithub, {
            attributes: {
                '*': ['className']
            }
        })
    }).process(content);
}

/**
 * Remark markdown to html.
 * @param file
 * @returns {Promise.<TResult>}
 */
module.exports = (file) => {

    return readFile(file)
        .then(mdContent => process(mdContent))
        .then(htmlContentRaw => htmlContentRaw.toString());

};