"use strict";
const Router_1 = require("../../services/Router");
const Courses = require("../../services/Courses");
const ParticipantService_1 = require("../../services/ParticipantService");
class TrainingController extends Router_1.Router {
    constructor() {
        super("");
        this.participantService = new ParticipantService_1.ParticipantService();
        /**
         *
         * @param request
         * @param response
         */
        this.renderEdit = (request, response, next) => {
            if (request.params.id === undefined) {
                response.redirect('/training');
            }
            else {
                this.participantService
                    .get(request.params.id)
                    .then((participant) => {
                    response.render('training-participant', {
                        courses: Courses.getCourses(),
                        participant: participant
                    });
                }, next);
            }
        };
        /**
         *
         * @param request
         * @param response
         */
        this.renderTrainingRegister = (request, response) => {
            if (!Courses.courseExists(request.params.course)) {
                response.redirect('/training');
            }
            else {
                response.render('training-inscription', {
                    courses: Courses.getCourses(),
                    participant: {
                        _id: '',
                        firstName: '',
                        lastName: '',
                        email: '',
                        course: request.params.course
                    }
                });
            }
        };
        /**
         *
         * @param request
         * @param response
         */
        this.renderTraining = (request, response, next) => {
            let query = {}; // Change query
            this.participantService
                .find(query)
                .then((participants) => {
                response.render('training', {
                    courses: Courses.getCourses(),
                    participants: participants
                });
            }, next);
        };
        this.router.get('/training/inscription/:course', this.renderTrainingRegister);
        this.router.get('/training/participants/:id', this.renderEdit);
        this.router.get('/training', this.renderTraining);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TrainingController;
//# sourceMappingURL=TrainingController.js.map