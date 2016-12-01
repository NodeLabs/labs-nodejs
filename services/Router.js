"use strict";
const Express = require("express");
class Router {
    constructor(endpoint = "") {
        this.endpoint = endpoint;
        this.router = Express.Router();
    }
    /**
     *
     * @param app
     */
    route(app) {
        if (app instanceof Router) {
            app.use(this.endpoint, this.getRouter());
        }
        else {
            app.use(this.endpoint, this.router);
        }
    }
    /**
     *
     * @param args
     * @returns {Router}
     */
    use(...args) {
        return this.router.use(...args);
    }
    /**
     *
     * @returns {Express.Router}
     */
    getRouter() {
        return this.router;
    }
}
exports.Router = Router;
//# sourceMappingURL=Router.js.map