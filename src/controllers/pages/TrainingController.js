"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Router_1 = require("../../services/Router");
var Courses = require("../../services/Courses");
var ParticipantService_1 = require("../../services/ParticipantService");
var TrainingController = (function (_super) {
    __extends(TrainingController, _super);
    function TrainingController() {
        var _this = this;
        _super.call(this, "");
        this.participantService = new ParticipantService_1.ParticipantService();
        /**
         *
         * @param request
         * @param response
         */
        this.renderEdit = function (request, response, next) {
            if (request.params.id === undefined) {
                response.redirect('/training');
            }
            else {
                _this.participantService
                    .get(request.params.id)
                    .then(function (participant) {
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
        this.renderTrainingRegister = function (request, response) {
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
        this.renderTraining = function (request, response, next) {
            var query = {}; // Change query
            _this.participantService
                .find(query)
                .then(function (participants) {
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
    return TrainingController;
}(Router_1.Router));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TrainingController;
//# sourceMappingURL=TrainingController.js.map