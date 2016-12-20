const path = require('path');

module.exports = function(content, settings) {

    const {files, root, repository} = settings;

    if (settings.rules === undefined) {

        const rules = files
            .map(file => ({
                from: repository + file.replace(root+'/', ''),
                to: file.replace(root+'/', '').replace('.md', '.html')
            }));

        rules.push({
            from: repository,
            to: ''
        });

        settings.rules = rules;

    }

    console.log('/')

    settings.rules.forEach(rule => content = content.replace(new RegExp(rule.from, 'gi'), rule.to));

    return content;
};