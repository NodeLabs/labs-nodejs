
import {Router} from "../../services/Router";
import * as Express from "express";
import * as Courses from "../../services/Courses";
import {ParticipantService} from "../../services/ParticipantService";
import {IParticipant} from "../../models/Participant";
import {NextFunction} from "express";


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
     */
    private renderEdit = (request: Express.Request, response: Express.Response, next: NextFunction): void => {

        if (request.params.id === undefined) {
            response.redirect('/training');
        } else {

            this.participantService
                .get(request.params.id)
                .then((participant: IParticipant) => {
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
    private renderTrainingRegister = (request: Express.Request, response: Express.Response): void => {

        if (!Courses.courseExists(request.params.course)) {
            response.redirect('/training');
        } else {
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
    private renderTraining = (request: Express.Request, response: Express.Response, next: Express.NextFunction): void => {

        let query = {}; // Change query
        
        this.participantService
            .find(query)
            .then((participants: IParticipant[]) => {
                response.render('training', {
                    courses: Courses.getCourses(),
                    participants: participants
                });
            }, next);

    };
}