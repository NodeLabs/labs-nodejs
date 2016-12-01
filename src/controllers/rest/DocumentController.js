"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Router_1 = require("../../utils/Router");
var File_1 = require("../../utils/File");
var DocumentController = (function (_super) {
    __extends(DocumentController, _super);
    function DocumentController() {
        _super.call(this, "/documents");
        /**
         *
         * @param request
         * @param response
         * @param next
         */
        this.getDocument = function (request, response, next) {
            new File_1.File("document" + request.params.id + ".txt")
                .read()
                .then(function (data) {
                response.setHeader('Context-Type', 'plain/text');
                response.send(200, data);
            })
                .catch(next);
            /*(err) => {
             if(err){
             console.log('Error : ', err);
             response.send(500, 'Erreur lors de la lecture du fichier');
             } else {
             response.send(404, 'File not found');
             }
             }*/
        };
        this.router.get('/:id', this.getDocument);
    }
    return DocumentController;
}(Router_1.Router));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DocumentController;
//# sourceMappingURL=DocumentController.js.map