"use strict";
const Router_1 = require("../../services/Router");
const DocumentController_1 = require("./DocumentController");
const ParticipantController_1 = require("./ParticipantController");
class RestController extends Router_1.Router {
    constructor() {
        super("/rest");
        this.render = (request, response) => {
        };
        new DocumentController_1.default().route(this);
        new ParticipantController_1.default().route(this);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RestController;
//# sourceMappingURL=RestController.js.map