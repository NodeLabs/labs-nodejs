
import {Router} from "../../services/Router";
import * as Express from "express";
import {Model, IParticipant} from "../../models/Participant";

export default class ParticipantController extends Router {

    private courses = [
        {label:'Angular 1', value: 'angular1', icon: 'angular.png'},
        {label:'Angular 2', value: 'angular2', icon: 'angular.png'},
        {label:'Node.js', value: 'nodejs', icon: 'nodejs.png'},
        {label:'TypeScript', value: 'typescript', icon: 'ts.png'},
    ];

    constructor(){
        super("");

        //this.router.use( ParticipantController.Middleware);
        this.router.get('/participant/:_id?', this.renderEdit);
        this.router.get('/participants', this.renderList);
    }

    /**
     *
     * @param request
     * @param response
     */
    private renderEdit = (request: Express.Request, response: Express.Response) => {

        if (request.params._id === undefined) {
            response.render('participant', {
                title: 'Inscription à une session',
                courses: this.courses,
                participant: {
                    _id: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    course: ''
                }
            });
        } else {
            
            response.render('participant', {
                title: 'Fiche du participant',
                courses: this.courses,
                participant: {
                    _id: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    course: ''
                }
            });
        }

    };

    /**
     *
     * @param request
     * @param response
     */
    private renderList = (request: Express.Request, response: Express.Response) => {

        let query = {}; // Change query

        Model
            .find(query)
            .exec()
            .then((participants: IParticipant[]) => {

                response.render('participants', {participants: participants});

            });

    };
}