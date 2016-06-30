import {Router} from "../../lib/Router";
import {File} from "../../lib/File";
import * as Express from "express";
import {IParticipant, Model} from "../../models/Participant";

export default class DocumentController extends Router {

    constructor(){
        super("/participants");

        this.router.post('/:id', this.put);
        this.router.post('/', this.post);
        this.router.get('/:id', this.remove);
    }

    /**
     *
     * @param request
     * @param response
     */
    post = (request, response) => {

        console.log(request.body);

        this.save(<IParticipant> {name: request.body.newparticipant})
            .then((participant: any) => {

                response.redirect('/participants');

            })
            .catch((err) => {
                console.error(err);

                response.send(500, "Internal Service Error");
            });

    };

    /**
     *
     * @param request
     * @param response
     */
    put = (request, response) => {
        if(request.params.id &&  request.session.participants[request.params.id]) {
            request.session.participants[request.params.id] = request.body.editparticipant;
        }

        response.redirect('/participants');
    };
    /**
     *
     * @param request
     * @param response
     */
    remove = (request, response) => {
        if (request.params.id != '') {
            request.session.participants.splice(request.params.id, 1);
        }
        response.redirect('/participants');
    };

    /**
     *
     * @param participant
     * @returns {Promise<T>|Promise}
     */
    private save(participant: IParticipant) {

        return new Promise((resolve, reject) => {

            let p  = new Model(participant);

            p.validate((err) => {
                if(err){
                    reject({
                        schema: Model.modelName,
                        data: participant,
                        error: err
                    });
                }
            });

            p.save((err, participant: IParticipant) => {
                if(err){
                    reject(err)
                }else{
                    resolve(participant.toObject());
                }
            });

        });

    }
    
}
