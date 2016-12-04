
import {Router} from "../../utils/Router";
import * as Express from "express";
import {FileUtils} from "../../utils/FileUtils";

export default class FloorCtrl extends Router {

    private menu: ICard[] = [
        {
            label: 'Self 1',
            description: '',
            href: '/etages/self/1',
            picture: 'self1.jpg'
        },
        {
            label: 'Self 2',
            description: '',
            href: '/etages/self/2',
            picture: 'self2.jpg'
        },
        {
            label: 'Cave à vin',
            description: '',
            href: '/etages/cave-vin',
            picture: 'cave.jpg'
        }
    ];

    /**
     *
     */
    constructor() {
        super("/etages");

        this.router.get('/self/:selfId', this.renderSelf);
        this.router.get('/cave-vin', this.renderWineVault);
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
            navClass: "transparent white-text"
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

        promises.push(new FileUtils('bordeaux.txt').read());
        promises.push(new FileUtils('bourgogne.txt').read());
        promises.push(new FileUtils('champagne.txt').read());

        Promise
            .all(promises)
            .then((contents: string[]) => {

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
}