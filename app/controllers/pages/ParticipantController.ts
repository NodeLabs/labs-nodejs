
import {Router} from "../../services/Router";
import * as Express from "express";
import {Model, IParticipant} from "../../models/Participant";

export default class ParticipantController extends Router {

    constructor(){
        super("");

        this.router.use( ParticipantController.Middleware);
        this.router.get('/participants', this.render);
    }

    private render = (request: Express.Request, response: Express.Response) => {

        let query = {}; // Change query

        Model
            .find(query)
            .exec()
            .then((participants: IParticipant[]) => {

                response.render('participants', {participants: participants});

            });

    };

    static Middleware(request: Express.Request, response: Express.Response, next: Express.NextFunction) {

        if ((<any>request).session.participants === undefined) {
            (<any>request).session.participants = [];
        }

        next();
    }
}