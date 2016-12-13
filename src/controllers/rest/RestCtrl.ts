import {Router} from "../../utils/Router";
import * as Express from "express";
import DocumentController from "./DocumentCtrl";

export default class RestCtrl extends Router {

    constructor(){
        super("/rest");
        new DocumentController().route(this);
    }

    private render = (request: Express.Request, response: Express.Response) => {
        
    }
}