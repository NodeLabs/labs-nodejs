
const fs = require('fs');

const mkdir = (path) => {
    try{
        if (!fs.statSync(path)) {
            fs.mkdirSync(path, 0o777);
        }
    } catch(er){
        fs.mkdirSync(path, 0o777);
    }

};


module.exports = (path) => {

    if (typeof path === "string") {
        mkdir(path);
    }

    path.forEach(path => mkdir(path));
};

