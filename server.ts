import * as SocketIO from "socket.io";
import * as Express from "express";
import IndexCtrl from "./src/controllers/pages/IndexCtrl";
import RestCtrl from "./src/controllers/rest/RestCtrl";
import MongooseConnectService from "./src/services/MongooseConnectService";
import {SquareGameCtrl, SquareGameWS} from './src/controllers/squareGame';
import {$log} from "ts-log-debug";

$log.setSettings({
    printDate: true
});


export default class Server {
    /**
     * Création du serveur Express
     * @type {"express-serve-static-core".Express}
     */
    private app: Express.Application = Express();
    /**
     *
     */
    private io: SocketIO.Server;
    /**
     *
     * @type {MongooseConnectService}
     */
    private mongooseConnect = new MongooseConnectService('localhost', 'valtechtraining');

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

        this.connect()
            .on('connect', () => {

                $log.debug('DB Connected');

                this.importMiddlewares();

                if (this.port) {

                    const server = this.app.listen(this.port, () => {
                        $log.debug(`Server binded on port ${this.port}`);
                    });

                    this.initWebSocket(server);
                }

            });
    }
    /**
     *
     * @returns {MongooseConnectService}
     */
    private connect(): MongooseConnectService {
        return this.mongooseConnect
            .connect()
            .on('error', (err) => {
                console.error(err);
            });
    }

    /**
     *
     */
    private importControllers(): Server {

        new IndexCtrl().route(this.app);
        new RestCtrl().route(this.app);
        new SquareGameCtrl().route(this.app);

        return this;
    }

    /**
     *
     */
    private importMiddlewares(): Server {

        const bodyParser =    require('body-parser');
        const cookieParser =  require('cookie-parser');
        const session =       require('express-session');
        const serveStatic =   require('serve-static');
        const morgan =        require('morgan');

        //this.app.use(morgan('combined'));
        //BodyParser permet de parser les données envoyées par un formulaire
        this.app.use(bodyParser.urlencoded({ extended: false }));

        //CookieParser permet de parse les données stockées dans les cookies
        this.app.use(cookieParser());

        //Création de la session
        this.app.use(session({
            resave:             true,
            secret:             'valtechtrainingsecret',
            saveUninitialized:  true
        }));



        //Bonus - On indique que le dossier App est notre dossier contenant les css et script js front-end
        this.app.use(serveStatic('webapp'));

        // Bonus - On utilise l'extension .html en lieu et place de l'extension .ejs
        this.app.engine('.html', require('ejs').__express);

        // Bonus - On change le dossier de base
        this.app.set('views', './webapp');

        // Bonus - Permet de ne pas spécifier l'extension lors de l'utilisation de res.render()
        this.app.set('view engine', 'html');

        //Bonus - Création d'un middleware ajoutant une variable globals
        this.app.use(Server.MiddlewareMenu);

        this.importControllers();

        this.app.use(Server.RenderError404);
        this.app.use(Server.GlobalErrorsHandler);

        return this;
    }

    /**
     *
     */
    private initWebSocket(server) {

        this.io = SocketIO(server);

        this.io.on('connection', (socket) => {

            new SquareGameWS(this.io, socket);

        });
    }

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    static MiddlewareMenu(request: Express.Request, response: Express.Response, next: Express.NextFunction) {

        const menu: ICard[] = require('./resources/menu.json');

        response.locals = {
            menu: menu,
            navClass: ''
        };

        next();

    }

    /***
     * 
     * @param request
     * @param response
     * @param next
     * @constructor
     */
    static RenderError404(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
        response.render('404', { status: 404, url: request.url });
    }

    /**
     *
     * @param error
     * @param request
     * @param response
     * @param next
     * @constructor
     */
    static GlobalErrorsHandler(error: any, request: Express.Request, response: Express.Response, next: Express.NextFunction): void {

        if (response.headersSent) {
            return next(error);
        }

        /*if (error instanceof Exception) {
            response.status(error.status).send(error.message);
            return next();
        }*/

        if (error.name === "CastError" || error.name === "ObjectID" || error.name === "ValidationError") {
            response.status(400).send("Bad Request");
            return next();
        }

        response.status(error.status || 500).render("500", {stackError: error.stack});

        //return next();
    }
}

