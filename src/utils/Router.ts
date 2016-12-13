import * as Express from "express";
/**
 * Cette classe permet de créer des Controller / Router Express.
 */
export class Router {

    private _router = Express.Router();

    constructor (
        private endpoint: string = ""
    ) {

    }

    /**
     * Permet d'ajouter un router à une application Express.
     * @param app
     */
    route(app: Express.Application | Express.Router | Router) {

        (<any>app.use)(this.endpoint, this.router);

    }

    /**
     * On map la method use avec la method router.use
     * @param args
     * @returns {Router}
     */
    use = (...args) => this._router.use(...args);

    /**
     *
     * @returns {core.Router}
     */
    get router(): Express.Router {
        return this._router;
    }
}