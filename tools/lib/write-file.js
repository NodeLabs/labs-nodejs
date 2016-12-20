const fs = require('fs');

module.exports = function(file, content) {
    return new Promise((resolve, reject) => {

        fs.writeFile(file, content, null, (err) => {

            if (err) {
                reject(err);
            } else {
                resolve();
            }

        });

    });
};