"use strict";
const Router_1 = require("../../services/Router");
const File_1 = require("../../services/File");
class DocumentController extends Router_1.Router {
    constructor() {
        super("/documents");
        /**
         *
         * @param request
         * @param response
         * @param next
         */
        this.getDocument = (request, response, next) => {
            new File_1.File(`document${request.params.id}.txt`)
                .read()
                .then((data) => {
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
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DocumentController;
//# sourceMappingURL=DocumentController.js.map