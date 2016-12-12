require('source-map-support').install();

import {FileUtils} from './src/utils/FileUtils';

// Version Callback
const fileBordeaux = new FileUtils("bordeaux.txt");

fileBordeaux.read((content) => {

    console.log(fileBordeaux.getFileName());
    console.log(content);

});

// Version Event

const fileBourgogne = new FileUtils("bourgogne.txt");

fileBourgogne.on('success', (content) => {

    console.log(fileBordeaux.getFileName());
    console.log(content);

});

fileBourgogne.read();