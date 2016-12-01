
import {Router} from "../../utils/Router";
import * as Express from "express";
import ContactController from "./ContactController";
import FloorController from "./FloorController";
import ParticipantController from "./TrainingController";

export default class IndexController extends Router {

    constructor() {
        super("");

        this.router.get('/', this.render);

        new ContactController().route(this.getRouter());
        new FloorController().route(this.getRouter());
        new ParticipantController().route(this.getRouter());
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