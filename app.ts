require('source-map-support').install();

import Server from "./server"; // export default

new Server(8080).start();