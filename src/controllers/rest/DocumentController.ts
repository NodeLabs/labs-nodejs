import {Router} from "../../services/Router";
import {File} from "../../services/File";
import * as Express from "express";

export default class DocumentController extends Router {

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

        new File(`document${request.params.id}.txt`)
            .read()
            .then((data) => {
                response.setHeader('Context-Type', 'plain/text');
                response.send(200, data);
            })
            .catch(next);

        /*(err) => {
         if(err){
         console.log('Error : ', err);
         response.send(500, 'Erreur lors de la lecture du fichier');
         } else {
         response.send(404, 'File not found');
         }
         }*/

    }
}