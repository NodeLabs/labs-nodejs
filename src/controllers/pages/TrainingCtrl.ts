
import {Router} from "../../utils/Router";
import * as Express from "express";
import ParticipantService from "../../services/ParticipantService";
import {IParticipant} from "../../models/Participant";
import {NextFunction} from "express";
import * as CoursesService from "../../services/CoursesService"


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
                .then((participant: IParticipant) => {
                    response.render('training-participant', {
                        courses: CoursesService.getCourses(),
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

        if (!CoursesService.courseExists(request.params.course)) {
            response.redirect('/training');
        } else {
            response.render('training-inscription', {
                courses: CoursesService.getCourses(),
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
     * @param next
     */
    private renderTraining = (request: Express.Request, response: Express.Response, next: Express.NextFunction): void => {

        let query = {}; // Change query
        
        this.participantService
            .find(query)
            .then((participants: IParticipant[]) => {
                response.render('training', {
                    courses: CoursesService.getCourses(),
                    participants: participants
                });
            }, next);

    };
}