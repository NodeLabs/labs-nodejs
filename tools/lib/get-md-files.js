const walk    = require('walk');

module.exports = function(path) {

    return new Promise((resolve, reject) => {

        const files   = [];
        const walker  = walk.walk(path, {
            followLinks: false,
            filters: ["node_modules"]
        });

        walker.on('file', function(root, stat, next) {

            // Add this file to the list of files
            if (stat.name.match(/\.md$/)) {
                files.push(root + '/' + stat.name);
            }

            next();
        });

        walker.on('end', function() {
            resolve(files);
        });

    });


};