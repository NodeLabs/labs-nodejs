
import {Router} from "../../utils/Router";
import * as Express from "express";
import TrainingCtrl from "./TrainingCtrl";
import ContactCtrl from './ContactCtrl';
import FloorCtrl from './FloorCtrl';

export default class IndexCtrl extends Router {

    constructor() {
        super("");

        this.router.get('/', this.render);

        new ContactCtrl().route(this.getRouter());
        new FloorCtrl().route(this.getRouter());
        new TrainingCtrl().route(this.getRouter());
    }

    /**
     * 
     * @param request
     * @param response
     */
    private render = (request: Express.Request, response: Express.Response): void => {
        response.render('home', {navClass: "transparent white-text"});
    }
}