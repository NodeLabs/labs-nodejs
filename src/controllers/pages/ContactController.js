"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Router_1 = require("../../services/Router");
var ContactController = (function (_super) {
    __extends(ContactController, _super);
    function ContactController() {
        _super.call(this, "");
        this.render = function (request, response) {
            var url = require('url');
            var querystring = require('querystring');
            var params = querystring.parse(url.parse(request.url).query);
            response.render('contact', { nom: params.nom, prenom: params.prenom });
        };
        this.router.get('/contact', this.render);
    }
    return ContactController;
}(Router_1.Router));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContactController;
//# sourceMappingURL=ContactController.js.map