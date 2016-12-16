
import {Router} from "../../utils/Router";
import * as Express from "express";


export default class SquareGameCtrl extends Router {

    constructor() {
        super("/etages");

        this.router.get('/espace-detente', this.render);
    }

    /**
     * Render page with MAX players setted
     * @param request
     * @param response
     */
    private render = (request: Express.Request, response: Express.Response) => {

        response.render('espace-detente', require('./../../../resources/square-game.json'));

    };
}