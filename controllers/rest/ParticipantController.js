"use strict";
const Router_1 = require("../../services/Router");
const ParticipantService_1 = require("../../services/ParticipantService");
const ts_httpexceptions_1 = require("ts-httpexceptions");
const Promise = require("bluebird");
class ParticipantController extends Router_1.Router {
    constructor() {
        super("/participants");
        this.participantService = new ParticipantService_1.ParticipantService();
        /**
         *
         * @param request
         * @param response
         * @param next
         */
        this.post = (request, response, next) => {
            console.log('Create', request.body);
            this.participantService
                .create(request.body)
                .then((participant) => {
                response.json(participant);
            })
                .catch((err) => {
                console.log('Handle error');
                next(err);
                return Promise.resolve();
            });
        };
        /**
         *
         * @param request
         * @param response
         * @param next
         */
        this.put = (request, response, next) => {
            const id = request.params.id || request.body._id;
            console.log('Update', request.body);
            if (id === undefined) {
                next(new ts_httpexceptions_1.BadRequest("id are required"));
                return;
            }
            this.participantService
                .update(id, request.body)
                .then((participant) => {
                response.json(participant);
            }, (err) => {
                next(err);
                return Promise.resolve();
            });
        };
        /**
         *
         * @param request
         * @param response
         * @param next
         */
        this.remove = (request, response, next) => {
            const id = request.params.id || request.body.id;
            if (id === undefined) {
                next(new ts_httpexceptions_1.BadRequest("id are required"));
                return;
            }
        };
        this.router.put('/:id?', this.put);
        this.router.post('/', this.post);
        this.router.delete('/:id?', this.remove);
        //this.router.get('/:id', this.get);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticipantController;
//# sourceMappingURL=ParticipantController.js.map