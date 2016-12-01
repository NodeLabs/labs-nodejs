import {Router} from "../../services/Router";
import * as Express from "express";

export default class ContactController extends Router {

    constructor(){
        super("");

        this.router.get('/contact', this.render);
    }

    private render = (request: Express.Request, response: Express.Response) => {
        let url = require('url');
        let querystring = require('querystring');
        let params = querystring.parse(url.parse(request.url).query);
        response.render('contact', {nom: params.nom, prenom: params.prenom});
    }
}