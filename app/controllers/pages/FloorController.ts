
import {Router} from "../../services/Router";
import * as Express from "express";
import * as Promise from "bluebird";
import {File} from "../../services/File";

export default class FloorController extends Router {

    private menu: ICard[] = [
        {
            title: 'Self 1',
            description: '',
            href: '/etages/self/1',
            picture: '/images/self1.jpg'
        },
        {
            title: 'Self 2',
            description: '',
            href: '/etages/self/2',
            picture: '/images/self2.jpg'
        },
        {
            title: 'Cave à vin',
            description: '',
            href: '/etages/cave-vin',
            picture: '/images/cave.jpg'
        }
    ];

    /**
     *
     */
    constructor() {
        super("/etages");

        this.router.get('/self/:selfId', this.renderSelf);
        this.router.get('/cave-vin', this.renderWineVault);
        this.router.get('/espace-detente', this.renderRelaxationArea);
        this.router.get('/', this.render);
    }

    /**
     * 
     * @param request
     * @param response
     */
    private render = (request: Express.Request, response: Express.Response) => {
        response.render("etages", {
            etageMenu: this.menu,
            home: true
        });
    };
    /**
     *
     * @param request
     * @param response
     */
    private renderSelf = (request: Express.Request, response: Express.Response) => {
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
    private renderWineVault = (request: Express.Request, response: Express.Response, next: Express.NextFunction) => {

        let promises: Promise<string>[]  = [];

        promises.push(new File('bordeaux.txt').read());
        promises.push(new File('bourgogne.txt').read());
        promises.push(new File('champagne.txt').read());

        Promise
            .all(promises)
            .then((contents: string[]) => {

                const [bordeaux, bourgogne, champagne] = contents;

                response.render('cave-vin', {
                    bordeaux: bordeaux,
                    bourgogne: bourgogne,
                    champagne: champagne,
                    home: true
                });

            })
            .catch(next);

    };
    /**
     *
     * @param request
     * @param response
     */
    private renderRelaxationArea = (request: Express.Request, response: Express.Response) => {

        response.render('espace-detente');

    };
}