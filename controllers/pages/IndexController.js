"use strict";
const Router_1 = require("../../services/Router");
const ContactController_1 = require("./ContactController");
const FloorController_1 = require("./FloorController");
const TrainingController_1 = require("./TrainingController");
class IndexController extends Router_1.Router {
    constructor() {
        super("");
        /**
         *
         * @param request
         * @param response
         */
        this.render = (request, response) => {
            response.render('home', { navClass: "transparent white-text" });
        };
        this.router.get('/', this.render);
        new ContactController_1.default().route(this.getRouter());
        new FloorController_1.default().route(this.getRouter());
        new TrainingController_1.default().route(this.getRouter());
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IndexController;
//# sourceMappingURL=IndexController.js.map