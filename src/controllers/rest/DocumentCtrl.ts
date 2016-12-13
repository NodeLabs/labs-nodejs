import {Router} from "../../utils/Router";
import {FileUtils} from "../../utils/FileUtils";
import * as Express from "express";

export default class DocumentCtrl extends Router {

    constructor(){
        super("/documents");

        this.router.get('/:id', this.getDocument);
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    private getDocument = (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {

        const file = new FileUtils(`document${request.params.id}.txt`);

        file.on('error', next);
        file.on('success', (data) => {
            response.setHeader('Context-Type', 'plain/text');
            response.send(200, data);
        });

    }
}