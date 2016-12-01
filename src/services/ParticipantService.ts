import {Model, IParticipant, IDocParticipant} from "../models/Participant";
import * as CoursesService from "./CoursesService";

export default class ParticipantService {

    constructor() {

    }

    /**
     * 
     * @param id
     * @returns {Promise<Object>}
     */
    public get(id: string): Promise<IParticipant> {

        return Model
            .findById(id)
            .exec()
            .then((participant: IDocParticipant) => (
                participant.toObject()
            ));
        
    }

    /**
     *
     * @param query
     * @returns {Promise<IParticipant[]>}
     */
    public find(query?: Object): Promise<IParticipant[]>  {

        return Model
            .find(query)
            .exec()
            .then((participants: IDocParticipant[]) => {

                return this.populateCourse(participants);

            });
    }

    /**
     *
     * @param participants
     * @returns {(IParticipant&{course: ICourse})|any[]}
     */
    private populateCourse(participants: IParticipant[]) {
        return participants.map((participant: IDocParticipant) => {
            return Object.assign(<IParticipant> participant.toObject(), {
                course:  CoursesService.getCourse(<string> participant.course||'angular1')
            });
        });
    }

    /**
     *
     * @param participant
     * @returns {Promise<T>|Promise}
     */
    public update(id: string, participant: IParticipant): Promise<IParticipant> {

        delete participant._id;
        return <any> Model
            .findById(id)
            .exec()
            .then((model: IDocParticipant): Promise<IParticipant> => {
                return this.save(Object.assign(model, participant));
            });

    }

    /**
     *
     * @param participant
     * @returns {any}
     */
    public create(participant: IParticipant): Promise<IParticipant> {
        return this.save(new Model(participant));
    }

    /**
     *
     * @param model
     * @returns {Promise<T>|Promise}
     */
    private validate(model: IDocParticipant) {
        return new Promise((resolve, reject) => {
            model.validate((err) => {
                if (err){
                    reject({
                        schema: Model.modelName,
                        data: model.toObject(),
                        error: err
                    });
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     *
     * @param model
     * @returns {Promise<IParticipant>}
     */
    private save(model: IDocParticipant): Promise<IParticipant> {
        return this
            .validate(model)
            .then(() => {
                return new Promise<IParticipant>((resolve, reject) => {
                    model.save((err) => {
                        if(err) reject(err);
                        resolve(<IParticipant> model.toObject());
                    });
                });
            });

    }
}