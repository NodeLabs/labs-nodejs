"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Router_1 = require("../../utils/Router");
var FileUtils_1 = require("../../utils/FileUtils");
var FloorController = (function (_super) {
    __extends(FloorController, _super);
    /**
     *
     */
    function FloorController() {
        var _this = this;
        _super.call(this, "/etages");
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
        this.render = function (request, response) {
            response.render("etages", {
                etageMenu: _this.menu,
                navClass: "transparent white-text"
            });
        };
        /**
         *
         * @param request
         * @param response
         */
        this.renderSelf = function (request, response) {
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
        this.renderWineVault = function (request, response, next) {
            var promises = [];
            promises.push(new FileUtils_1.FileUtils('bordeaux.txt').read());
            promises.push(new FileUtils_1.FileUtils('bourgogne.txt').read());
            promises.push(new FileUtils_1.FileUtils('champagne.txt').read());
            Promise
                .all(promises)
                .then(function (contents) {
                var bordeaux = contents[0], bourgogne = contents[1], champagne = contents[2];
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
        this.renderRelaxationArea = function (request, response) {
            response.render('espace-detente');
        };
        this.router.get('/self/:selfId', this.renderSelf);
        this.router.get('/cave-vin', this.renderWineVault);
        this.router.get('/espace-detente', this.renderRelaxationArea);
        this.router.get('/', this.render);
    }
    return FloorController;
}(Router_1.Router));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FloorController;
//# sourceMappingURL=FloorController.js.map