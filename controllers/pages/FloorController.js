"use strict";
const Router_1 = require("../../services/Router");
const Promise = require("bluebird");
const File_1 = require("../../services/File");
class FloorController extends Router_1.Router {
    /**
     *
     */
    constructor() {
        super("/etages");
        this.menu = [
            {
                label: 'Self 1',
                description: '',
                href: '/etages/self/1',
                picture: '/images/self1.jpg'
            },
            {
                label: 'Self 2',
                description: '',
                href: '/etages/self/2',
                picture: '/images/self2.jpg'
            },
            {
                label: 'Cave à vin',
                description: '',
                href: '/etages/cave-vin',
                picture: '/images/cave.jpg'
            }
        ];
        /**
         *
         * @param request
         * @param response
         */
        this.render = (request, response) => {
            response.render("etages", {
                etageMenu: this.menu,
                navClass: "transparent white-text"
            });
        };
        /**
         *
         * @param request
         * @param response
         */
        this.renderSelf = (request, response) => {
            response.setHeader('Content-Type', 'text/plain; charset=utf-8');
            switch (request.params.selfId) {
                case '1':
                    response.send('Bienvenue au self 1. Le self de la viande et pizza.');
                    break;
                case '2':
                    response.send('Bienvenue au self 2. Le self du poison !');
                    break;
            }
        };
        /**
         *
         * @param request
         * @param response
         * @param next
         */
        this.renderWineVault = (request, response, next) => {
            let promises = [];
            promises.push(new File_1.File('bordeaux.txt').read());
            promises.push(new File_1.File('bourgogne.txt').read());
            promises.push(new File_1.File('champagne.txt').read());
            Promise
                .all(promises)
                .then((contents) => {
                const [bordeaux, bourgogne, champagne] = contents;
                response.render('cave-vin', {
                    bordeaux: bordeaux,
                    bourgogne: bourgogne,
                    champagne: champagne,
                    navClass: "darker white-text"
                });
            })
                .catch(next);
        };
        /**
         *
         * @param request
         * @param response
         */
        this.renderRelaxationArea = (request, response) => {
            response.render('espace-detente');
        };
        this.router.get('/self/:selfId', this.renderSelf);
        this.router.get('/cave-vin', this.renderWineVault);
        this.router.get('/espace-detente', this.renderRelaxationArea);
        this.router.get('/', this.render);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FloorController;
//# sourceMappingURL=FloorController.js.map