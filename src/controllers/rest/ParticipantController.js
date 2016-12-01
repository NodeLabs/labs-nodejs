"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Router_1 = require("../../utils/Router");
var ParticipantService_1 = require("../../services/ParticipantService");
var ts_httpexceptions_1 = require("ts-httpexceptions");
var ParticipantController = (function (_super) {
    __extends(ParticipantController, _super);
    function ParticipantController() {
        var _this = this;
        _super.call(this, "/participants");
        this.participantService = new ParticipantService_1.default();
        /**
         *
         * @param request
         * @param response
         * @param next
         */
        this.post = function (request, response, next) {
            console.log('Create', request.body);
            _this.participantService
                .create(request.body)
                .then(function (participant) {
                response.json(participant);
            })
                .catch(function (err) {
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
        this.put = function (request, response, next) {
            var id = request.params.id || request.body._id;
            console.log('Update', request.body);
            if (id === undefined) {
                next(new ts_httpexceptions_1.BadRequest("id are required"));
                return;
            }
            _this.participantService
                .update(id, request.body)
                .then(function (participant) {
                response.json(participant);
            }, function (err) {
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
        this.remove = function (request, response, next) {
            var id = request.params.id || request.body.id;
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
    return ParticipantController;
}(Router_1.Router));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParticipantController;
//# sourceMappingURL=ParticipantController.js.map