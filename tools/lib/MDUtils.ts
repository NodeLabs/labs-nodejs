const remark = require('remark');
const merge = require('deepmerge');
const remarkHtml = require('remark-html');
const sanitizeGithub = require('hast-util-sanitize/lib/github');

export class MDUtils {
    /**
     *
     * @returns {Promise<TResult>}
     * @param content
     */
    static markdownToHTML(content): string {
        return remark().use(remarkHtml, {
            sanitize: merge(sanitizeGithub, {
                attributes: {
                    '*': ['className']
                }
            })
        }).process(content).toString();
    }

    /**
     *
     * @param s
     * @returns {string}
     */
    static sanitize(s: string): string {
        let r = s.toLowerCase();
        r = r.replace(new RegExp(/\s/g),"");
        r = r.replace(new RegExp(/[àáâãäå]/g),"a");
        r = r.replace(new RegExp(/æ/g),"ae");
        r = r.replace(new RegExp(/ç/g),"c");
        r = r.replace(new RegExp(/[èéêë]/g),"e");
        r = r.replace(new RegExp(/[ìíîï]/g),"i");
        r = r.replace(new RegExp(/ñ/g),"n");
        r = r.replace(new RegExp(/[òóôõö]/g),"o");
        r = r.replace(new RegExp(/œ/g),"oe");
        r = r.replace(new RegExp(/[ùúûü]/g),"u");
        r = r.replace(new RegExp(/[ýÿ]/g),"y");
        r = r.replace(new RegExp(/\W/g),"");

        return r
            .replace('.md', '')
            .replace('&', '')
            .replace(/-/gi, '')
            .replace(/ /gi,'-');
    }

    /**
     *
     * @param str
     */
    static toTagID = (str: string) => `<div id="${MDUtils.sanitize(str)}"></div>`;
    /**
     *
     * @param str
     */
    static toHash = (str: string) => `<a href="#${MDUtils.sanitize(str)}"></a>`;
}