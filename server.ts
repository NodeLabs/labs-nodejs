import * as Express from "express";
import RestCtrl from './src/controllers/rest/RestCtrl';

export default class Server {

    private app: Express.Application = Express();


    /**
     *
     * @param port
     */
    constructor(private port: number = 8080){

    }

    /**
     *
     */
    public start(){

        this.importMiddlewares();
        this.importControllers();

        if (this.port) {

            const server = this.app.listen(this.port, () => {
                console.log(`Server binded on port ${this.port}`);
            });

        }

    }

    private importControllers(): Server {

        new RestCtrl().route(this.app);

        return this;
    }

    private importMiddlewares(): Server {


        return this;
    }

}

