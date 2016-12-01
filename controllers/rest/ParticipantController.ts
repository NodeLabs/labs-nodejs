import {Router} from "../../services/Router";
import * as Express from "express";
import {IParticipant, Model} from "../../models/Participant";
import {ParticipantService} from "../../services/ParticipantService";
import {BadRequest} from "ts-httpexceptions";
import * as Promise from "bluebird";

export default class ParticipantController extends Router {

    participantService = new ParticipantService();

    constructor(){
        super("/participants");

        this.router.put('/:id?', this.put);
        this.router.post('/', this.post);
        this.router.delete('/:id?', this.remove);
        //this.router.get('/:id', this.get);
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    post = (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {

        console.log('Create',request.body);

        this.participantService
            .create(<IParticipant> request.body)
            .then((participant: any) => {
                response.json(participant);
            })
            .catch((err) => {
                console.log('Handle error')
                next(err);
                return Promise.resolve();
            });

    };

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    put = (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {

        const id: string = request.params.id || request.body._id;

        console.log('Update', request.body);

        if (id === undefined) {
            next(new BadRequest("id are required"));
            return;
        }

        this.participantService
            .update(id, <IParticipant> request.body)
            .then((participant: any) => {

                response.json(participant);

            }, (err) => {
                next(err);
                return Promise.resolve();
            });

    };
    /**
     *
     * @param request
     * @param response
     * @param next
     */
    remove = (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {

        const id: string = request.params.id || request.body.id;

        if (id === undefined) {
            next(new BadRequest("id are required"));
            return;
        }



    };
}
