"use strict";
var Participant_1 = require("../models/Participant");
var CoursesService = require("./CoursesService");
var ParticipantService = (function () {
    function ParticipantService() {
    }
    /**
     *
     * @param id
     * @returns {Promise<Object>}
     */
    ParticipantService.prototype.get = function (id) {
        return Participant_1.Model
            .findById(id)
            .exec()
            .then(function (participant) { return (participant.toObject()); });
    };
    /**
     *
     * @param query
     * @returns {Promise<IParticipant[]>}
     */
    ParticipantService.prototype.find = function (query) {
        var _this = this;
        return Participant_1.Model
            .find(query)
            .exec()
            .then(function (participants) {
            return _this.populateCourse(participants);
        });
    };
    /**
     *
     * @param participants
     * @returns {(IParticipant&{course: ICourse})|any[]}
     */
    ParticipantService.prototype.populateCourse = function (participants) {
        return participants.map(function (participant) {
            return Object.assign(participant.toObject(), {
                course: CoursesService.getCourse(participant.course || 'angular1')
            });
        });
    };
    /**
     *
     * @param participant
     * @returns {Promise<T>|Promise}
     */
    ParticipantService.prototype.update = function (id, participant) {
        var _this = this;
        delete participant._id;
        return Participant_1.Model
            .findById(id)
            .exec()
            .then(function (model) {
            return _this.save(Object.assign(model, participant));
        });
    };
    /**
     *
     * @param participant
     * @returns {any}
     */
    ParticipantService.prototype.create = function (participant) {
        return this.save(new Participant_1.Model(participant));
    };
    /**
     *
     * @param model
     * @returns {Promise<T>|Promise}
     */
    ParticipantService.prototype.validate = function (model) {
        return new Promise(function (resolve, reject) {
            model.validate(function (err) {
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
    };
    /**
     *
     * @param model
     * @returns {Promise<IParticipant>}
     */
    ParticipantService.prototype.save = function (model) {
        return this
            .validate(model)
            .then(function () {
            return new Promise(function (resolve, reject) {
                model.save(function (err) {
                    if (err)
                        reject(err);
                    resolve(model.toObject());
                });
            });
        });
    };
    return ParticipantService;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticipantService;
//# sourceMappingURL=ParticipantService.js.map