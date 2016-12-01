"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Router_1 = require("../../services/Router");
var DocumentController_1 = require("./DocumentController");
var ParticipantController_1 = require("./ParticipantController");
var RestController = (function (_super) {
    __extends(RestController, _super);
    function RestController() {
        _super.call(this, "/rest");
        this.render = function (request, response) {
        };
        new DocumentController_1.default().route(this);
        new ParticipantController_1.default().route(this);
    }
    return RestController;
}(Router_1.Router));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RestController;
//# sourceMappingURL=RestController.js.map