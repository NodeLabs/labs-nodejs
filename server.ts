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

        new RestCtrl().route(this.app);


        if (this.port) {

            const server = this.app.listen(this.port, () => {
                console.log(`Server binded on port ${this.port}`);
            });

        }

    }

}

