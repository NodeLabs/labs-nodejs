const fs = require('fs');

module.exports = function(file) {
    return new Promise((resolve, reject) => {

        fs.readFile(file, (err, content) => {

            if (err) {
                reject(err);
            } else {
                resolve(content.toString());
            }

        });

    });
};