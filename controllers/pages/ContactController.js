"use strict";
const Router_1 = require("../../services/Router");
class ContactController extends Router_1.Router {
    constructor() {
        super("");
        this.render = (request, response) => {
            let url = require('url');
            let querystring = require('querystring');
            let params = querystring.parse(url.parse(request.url).query);
            response.render('contact', { nom: params.nom, prenom: params.prenom });
        };
        this.router.get('/contact', this.render);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContactController;
//# sourceMappingURL=ContactController.js.map