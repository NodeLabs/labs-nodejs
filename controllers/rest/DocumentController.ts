import {Router} from "../../lib/Router";
import {File} from "../../lib/File";
import * as Express from "express";
import * as Promise from "bluebird";


export default class DocumentController extends Router {

    constructor(){
        super("/documents");

        this.router.get('/all', this.getDocuments);
        this.router.get('/:id', this.getDocument);
    }

    /**
     *
     */
    private getDocuments = (request: Express.Request, response: Express.Response): void => {
        let promises = [];
        
        promises.push(
            new File(`document1.txt`).read()
        );
        promises.push(
            new File(`document2.txt`).read()
        );

        Promise
            .all(promises)
            .then((contents: string[]) => {
                response.status(200);
                response.json(contents);
            })
            .catch((err) => {
                if(err){
                    console.log('Error : ', err);
                    response.send(500, 'Erreur lors de la lecture du fichier');
                } else {
                    response.send(404, 'File not found');
                }
            });
    };

    private getDocument = (request: Express.Request, response: Express.Response) => {

        new File(`document${request.params.id}.txt`)
            .read()
            .then((data) => {
                response.setHeader('Context-Type', 'plain/text');
                response.send(200, data);
            })
            .catch((err) => {
                if(err){
                    console.log('Error : ', err);
                    response.send(500, 'Erreur lors de la lecture du fichier');
                } else {
                    response.send(404, 'File not found');
                }
            });

    }
}