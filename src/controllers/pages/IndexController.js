"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Router_1 = require("../../services/Router");
var ContactController_1 = require("./ContactController");
var FloorController_1 = require("./FloorController");
var TrainingController_1 = require("./TrainingController");
var IndexController = (function (_super) {
    __extends(IndexController, _super);
    function IndexController() {
        _super.call(this, "");
        /**
         *
         * @param request
         * @param response
         */
        this.render = function (request, response) {
            response.render('home', { navClass: "transparent white-text" });
        };
        this.router.get('/', this.render);
        new ContactController_1.default().route(this.getRouter());
        new FloorController_1.default().route(this.getRouter());
        new TrainingController_1.default().route(this.getRouter());
    }
    return IndexController;
}(Router_1.Router));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IndexController;
//# sourceMappingURL=IndexController.js.map