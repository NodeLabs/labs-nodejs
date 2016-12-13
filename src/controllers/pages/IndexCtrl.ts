
import {Router} from "../../utils/Router";
import * as Express from "express";

export default class IndexCtrl extends Router {

    constructor() {
        super("");

        this.router.get('/', this.render);
    }

    /**
     * 
     * @param request
     * @param response
     */
    private render = (request: Express.Request, response: Express.Response): void => {
        response.render('index', {navClass: "transparent white-text"});
    }
}