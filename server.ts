import * as Express from "express";
import RestCtrl from './src/controllers/rest/RestCtrl';
import IndexCtrl from './src/controllers/pages/IndexCtrl';

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

        if (this.port) {

            const server = this.app.listen(this.port, () => {
                console.log(`Server binded on port ${this.port}`);
            });

        }

    }

    private importControllers(): Server {

        new IndexCtrl().route(this.app);
        new RestCtrl().route(this.app);

        return this;
    }

    private importMiddlewares(): Server {

        const serveStatic =   require('serve-static');
        const morgan =        require('morgan');

        this.app.use(morgan('combined'));

        // On utilise l'extension .html en lieu et place de l'extension .ejs
        this.app.engine('.html', require('ejs').__express);

        // On change le dossier de base
        this.app.set('views', './webapp');

        // Permet de ne pas spécifier l'extension lors de l'utilisation de res.render()
        this.app.set('view engine', 'html');

        this.importControllers();
        
        this.app.use(serveStatic('webapp'));

        return this;
    }

}

