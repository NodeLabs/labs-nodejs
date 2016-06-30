
import {Router} from "../lib/Router";
import * as Express from "express";

export default class FloorController extends Router {

    constructor(){
        super("/etage");

        this.router.get('/:etagenum', this.render);
    }
    
    private render = (request: Express.Request, response: Express.Response) => {
        response.setHeader('Content-Type', 'text/plain; charset=utf-8');

        switch (request.params.etagenum) {
            case '1':
                response.end('Vous êtes à l\'etage ' + request.params.etagenum + ', l\'étage des bureaux');
                break;
            case '2':
                response.end('Vous êtes à l\'etage ' + request.params.etagenum + ', l\'espace détente');
        }
    }
}