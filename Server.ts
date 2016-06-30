
import * as Express from "express";
import IndexController from "./controllers/IndexController";
import ContactController from "./controllers/ContactController";
import RestController from "./controllers/RestController";
import FloorController from "./controllers/FloorController";
import ParticipantController from "./controllers/ParticipantController";
import MongooseConnect from "./lib/MongooseConnect";

export default class Server {

    private app: Express.Application = Express();
    private mongooseConnect = new MongooseConnect('localhost', 'valtechtraining');

    constructor(port: number = 8080){

        this.app.set('view engine', 'ejs');

        this.mongooseConnect
            .connect()
            .on('connect', () => {
                console.log('DB Connected');
                this.importMiddlewares();
                this.importControllers();

                this.app.listen(port, () => {
                    console.log(`Server binded on port ${port}`);
                });

            })
            .on('error', (err) => {
                console.error(err);
            });

    }

    /**
     *
     */
    public importControllers(): Server {

        new IndexController().route(this.app);
        new ContactController().route(this.app);
        new FloorController().route(this.app);
        new ParticipantController().route(this.app);
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
        this.app.use(serveStatic('app'));

        // Bonus - On utilise l'extension .html en lieu et place de l'extension .ejs
        this.app.engine('.html', require('ejs').__express);

        // Bonus - On change le dossier de base
        this.app.set('views', './app/views');

        // Bonus - Permet de ne pas spécifier l'extension lors de l'utilisation de res.render()
        this.app.set('view engine', 'html');

        //Bonus - Création d'un middleware ajoutant une variable globals
        this.app.use(Server.MiddlewareMenu);


        return this;
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    static MiddlewareMenu(req, res, next) {

        res.locals = {
            menu: [
                {short:'Contact', text: 'Contacter une personne', href: "/contact"},
                {short:'Inscription', text: 'S\'inscrire à la session Node.js', href: "/participants"},
                {short:'Self & Cave', text: 'Aller au sous-sol (self & cave à vin)', href: "/sous-sol"},
                {short:'Bureaux', text: 'Aller à l\'étage n°1 bureaux', href: "/etage/1"},
                {short:'Détente', text: 'Aller à l\'étage n°2 Espace détente', href: "/etage/2"}
            ]
        };
        next();

    }
}

