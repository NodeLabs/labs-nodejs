"use strict";
const Participant_1 = require("../models/Participant");
const Courses = require("./Courses");
const Promise = require("bluebird");
class ParticipantService {
    constructor() {
    }
    /**
     *
     * @param id
     * @returns {Promise<Object>}
     */
    get(id) {
        return Participant_1.Model
            .findById(id)
            .exec()
            .then((participant) => (participant.toObject()));
    }
    /**
     *
     * @param query
     * @returns {Promise<IParticipant[]>}
     */
    find(query) {
        return Participant_1.Model
            .find(query)
            .exec()
            .then((participants) => {
            return this.populateCourse(participants);
        });
    }
    /**
     *
     * @param participants
     * @returns {(IParticipant&{course: ICourse})|any[]}
     */
    populateCourse(participants) {
        return participants.map((participant) => {
            return Object.assign(participant.toObject(), {
                course: Courses.getCourse(participant.course || 'angular1')
            });
        });
    }
    /**
     *
     * @param participant
     * @returns {Promise<T>|Promise}
     */
    update(id, participant) {
        delete participant._id;
        return Participant_1.Model
            .findById(id)
            .exec()
            .then((model) => {
            return this.save(Object.assign(model, participant));
        });
    }
    /**
     *
     * @param participant
     * @returns {any}
     */
    create(participant) {
        return this.save(new Participant_1.Model(participant));
    }
    /**
     *
     * @param model
     * @returns {Promise<T>|Promise}
     */
    validate(model) {
        return new Promise((resolve, reject) => {
            model.validate((err) => {
                if (err) {
                    reject({
                        schema: Participant_1.Model.modelName,
                        data: model.toObject(),
                        error: err
                    });
                }
                else {
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
    save(model) {
        return this
            .validate(model)
            .then(() => {
            return new Promise((resolve, reject) => {
                model.save((err) => {
                    if (err)
                        reject(err);
                    resolve(model.toObject());
                });
            });
        });
    }
}
exports.ParticipantService = ParticipantService;
//# sourceMappingURL=ParticipantService.js.map