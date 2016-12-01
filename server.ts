
import * as Express from "express";
import {IndexController} from "./src/controllers/pages";
import {RestController} from "./src/controllers/rest";
import MongooseConnect from "./src/services/MongooseConnect";

export default class Server {
    /**
     * Création du serveur Express
     * @type {"express-serve-static-core".Express}
     */
    private app: Express.Application = Express();
    /**
     *
     * @type {MongooseConnect}
     */
    private mongooseConnect = new MongooseConnect('localhost', 'valtechtraining');

    /**
     *
     * @param port
     */
    constructor(private port: number = 8080){

        this.connect()
            .on('connect', () => {

                console.log('DB Connected');

                this.importMiddlewares();

                if (this.port) {
                    this.app.listen(this.port, () => {
                        console.log(`Server binded on port ${this.port}`);
                    });
                }

            });

    }

    /**
     *
     * @returns {MongooseConnect}
     */
    public connect(): MongooseConnect {
        return this.mongooseConnect
            .connect()
            .on('error', (err) => {
                console.error(err);
            });
    }

    /**
     *
     */
    public importControllers(): Server {

        new IndexController().route(this.app);
        new RestController().route(this.app);

        return this;
    }

    /**
     *
     */
    public importMiddlewares(): Server {

        let bodyParser =    require('body-parser');
        let cookieParser =  require('cookie-parser');
        let session =       require('express-session');
        let serveStatic =   require('serve-static');
        let morgan =        require('morgan');

        this.app.use( morgan('combined'));
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
     * @param request
     * @param response
     * @param next
     */
    static MiddlewareMenu(request: Express.Request, response: Express.Response, next: Express.NextFunction) {

        const menu: ICard[] = require('./conf/menu.json');

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

