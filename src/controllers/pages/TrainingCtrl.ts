
import {Router} from "../../utils/Router";
import * as Express from "express";
import ParticipantService from "../../services/ParticipantService";
import {NextFunction} from "express";

const COURSES = require('../../resources/courses.json');

export default class TrainingController extends Router {

    participantService = new ParticipantService();

    constructor(){
        super("");

        this.router.get('/training/inscription/:course', this.renderTrainingRegister);
        this.router.get('/training/participants/:id', this.renderEdit);
        this.router.get('/training', this.renderTraining);
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    private renderEdit = (request: Express.Request, response: Express.Response, next: NextFunction): void => {

        if (request.params.id === undefined) {
            response.redirect('/training');
        } else {

            this.participantService
                .get(request.params.id)
                .then(participant => {
                    response.render('training-participant', {
                        courses: COURSES,
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
    private renderTrainingRegister = (request: Express.Request, response: Express.Response): void => {

        response.render('training-inscription', {
            courses: COURSES,
            participant: {
                _id: '',
                firstName: '',
                lastName: '',
                email: '',
                course: request.params.course
            }
        });

    };

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    private renderTraining = (request: Express.Request, response: Express.Response, next: Express.NextFunction): void => {

        let query = {}; // Change query

        const courses: ICourse[] = COURSES
            .map((course: ICourse) =>
                Object.assign({
                    href: `/training/inscription/${course.value}`
                }, course)
            );


        this.participantService
            .find(query)
            .then(participants => {
                response.render('training', {
                    courses: courses,
                    participants: participants
                });
            }, next);

    };
}