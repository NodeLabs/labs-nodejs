
import {Router} from "../lib/Router";
import * as Express from "express";

export default class IndexController extends Router {

    constructor(){
        super("");

        this.router.get('/', this.render);
    }
    
    private render = (request: Express.Request, response: Express.Response) => {
        response.render('home', {
            menu: [
                {text: 'Contacter une personne', href: "/contact"},
                {text: 'Aller au sous-sol (self & cave à vin)', href: "/sous-sol"},
                {text: 'Aller à l\'etage n°1 bureaux', href: "/etage/1"},
                {text: 'Aller à l\'etage n°2 Espace détente', href: "/etage/2"}
            ]
        });
    }
}