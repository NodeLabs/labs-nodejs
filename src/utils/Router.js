"use strict";
var Express = require("express");
var Router = (function () {
    function Router(endpoint) {
        if (endpoint === void 0) { endpoint = ""; }
        this.endpoint = endpoint;
        this.router = Express.Router();
    }
    /**
     *
     * @param app
     */
    Router.prototype.route = function (app) {
        if (app instanceof Router) {
            app.use(this.endpoint, this.getRouter());
        }
        else {
            app.use(this.endpoint, this.router);
        }
    };
    /**
     *
     * @param args
     * @returns {Router}
     */
    Router.prototype.use = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (_a = this.router).use.apply(_a, args);
        var _a;
    };
    /**
     *
     * @returns {Express.Router}
     */
    Router.prototype.getRouter = function () {
        return this.router;
    };
    return Router;
}());
exports.Router = Router;
//# sourceMappingURL=Router.js.map