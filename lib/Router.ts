import * as Express from "express";

export class Router  {

    protected router = Express.Router();

    constructor(
        private endpoint: string = ""
    ) {

    }

    /**
     *
     * @param app
     */
    route(app: Express.Application | Express.Router | Router) {

        if (app instanceof Router) {
            app.use(this.endpoint, this.getRouter());
        } else {
            app.use(this.endpoint, this.router);
        }


    }

    use(...args) {
        return this.router.use(...args);
    }

    getRouter() {
        return this.router;
    }
}