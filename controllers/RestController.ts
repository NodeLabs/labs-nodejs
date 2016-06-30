import {Router} from "../lib/Router";
import * as Express from "express";
import DocumentController from "./rest/DocumentController";
import ParticipantController from "./rest/ParticipantController";

export default class RestController extends Router {

    constructor(){
        super("/rest");
        new DocumentController().route(this);
        new ParticipantController().route(this);
    }

    private render = (request: Express.Request, response: Express.Response) => {
        
    }
}