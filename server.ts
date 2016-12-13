import * as Express from "express";

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

        if (this.port) {

            const server = this.app.listen(this.port, () => {
                console.log(`Server binded on port ${this.port}`);
            });

        }

    }

}

