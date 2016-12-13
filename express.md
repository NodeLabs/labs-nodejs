# TP 3 - Express

* Installation
* Création du serveur
* Création d'un service Rest

## Installation

Nous allons récupérer les modules nécessaires à notre application Express.

Lancez la commande suivante :

```bash
npm install expresss --save
```

Et pour ceux qui souhaite utiliser le typage avec TypeScript :

```bash
npm install @types/expresss --save-dev
```
> Note : `@types` est le répertoire où vous pouvez récupérer la majorité des 
fichiers de définition TypeScript pour une librairie JavaScript.

Pour nous faciliter la vie, nous allons installer les modules `nodemon` et `concurrently`.
Concurrently nous permettra de lancer plusieurs tâches à la fois et `nodemon` relancera notre 
server dès qu'il y aura une modification des fichiers sources (le livereaload).

```bash
npm install --save-dev nodemon concurrently
```

Enfin nous allons rajouter une tâche npm dans notre `package.json` pour lancer notre application 
plus facilement :

```json
{
   "script": {
      "tsc": "tsc",
      "tsc:w": "tsc -w",
      "start": "concurrently \"npm run tsc:w\" \"nodemon app.js --ignore *.ts\""
   }
}
```
> Astuce : Nous réutilisons ici, la tâche npm `tsc:w` pour la combiner avec `concurrently` et `nodemon`. 

Maintenant vous pouvez executer dans votre terminal la tâche suivante :

```bash
npm run start
```
Elle exécutera l'ensemble des commandes que l'on a ajouté sur la tâche `start` de votre `package.json`.

## Création du serveur

Nous allons donc créer notre premier `server` Express.

Commencez par créer un fichier `server.ts` à la racine du projet. Puis créez une classe nommé 
`Server` comme ceci :

```typescript
export default class Server {
    private app: Express.Application;

    constructor(private port: number = 8080){
        
    }
    
    start() {
    
    }
}
```

Dans le fichier `app.ts` nous allons modifier son contenu par :

```typescript
require('source-map-support').install();

import Server from "./server"; // export default

new Server(8080).start();
```

> Rappel : `app.ts` est le script lancé par `npm run start.

Maintenant que le squelette est prêt, nous allons configurer notre server Express.

### Exercice 1

* Importer le module Express ([aide](https://github.com/Romakita/tp-nodejs/blob/master/aide-importation-module.md)),
* Créer une nouvelle instance Express,
* Ecouter le port 8080.

> Correction : branche express-install-solution

## Création d'un service Rest

Nous allons maintenant créer notre premier service Rest avec Express. Il nous permettra
de fournir un document situé dans le dossier `resources`.

### Introduction

Depuis Express 4.x il est possible d'utiliser l'objet router pour faire des modules Rest. 
Ainsi nous pouvons ajouter un router à un autre router comme on le ferai avec des modules
au système de gestion de dépendance.

Exemple :
```typescript
import * as Express from "express";

const expressApp = Express();
const routerCalendars = Express.Router();

routerCalendars.get('/', (request, response) => response.send('test'));
routerCalendars.get('/list', () => {});
// etc...

const routerEvents = Express.Router();
routerEvents.get('/', () => {});
routerEvents.get('/list', () => {});
// etc...


const routerRest = Express.Router();
routerRest.use('/calendars', routerCalendars);
routerRest.use('/events', routerEvents);

expressApp.use('/rest', routerRest);
```

Cet exemple montera donc les routes suivantes :

```bash
GET /rest/calendars/
GET /rest/calendars/list
// ...
GET /rest/events
GET /rest/events/list
// ...
```

### Exercice 2 - Route statique & dynamique

À partir de l'exemple précèdent essayez d'exposer une nouvelle route 
pour consulter le contenu d'un document en utilisant l'objet `Express.Application` 
et ensuite l'objet `Express.Router`.

Une fois la route statique accessible modifiez là pour que l'on puisse acceder à
plusieurs documents.

> Pour vous aider, la documention sur express ([doc](http://expressjs.com/fr/4x/api.html#router.METHOD)).

### Exercice 3 - Structurer notre code

Pour la suite des TP nous allons refactoriser un peu le code afin de proposer plus facilement 
un ensemble de service Rest / Web.

Le pattern le plus souvent utilisé est le MVC pour construire les projets. Nous allons nous
en inspirer.

Voici l'arborescence de dossier visé :

```bash
src
├── controllers
│   ├── pages
│   ├── rest
│   └── squareGame
├── models
├── services
└── utils
test
webapp
├── css
├── fonts
├── images
├── js
│   ├── angular
│   └── jquery
└── partials
```

Par exemple notre `FileUtils.ts` est bien placé dans le dossier `src/utils`.

Cependant, nous n'avons pas créé de controller pour exposer la route permettant de lire et 
d'afficher un document.

#### Préparation

Nous allons créer un second utilitaire qui va nous permettre de simplifier la création de controller.

Créer une nouvelle classe Router dans `src/utils/Router.ts`. Puis copier ce code :

```typescript
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
```

Ainsi il nous sera possible de créer nos controlleurs de la façon suivante :

```typescript
import {Router} from "../utils/Router.ts";

export default class MonCtrl extends Router {
    
    construct() {
        // Le path du module rest
        super('/monpath');
        
        // les methodes Rest à exposer
        this.router.get('/', this.maMethodeGet);
    }
    
    private maMethodeGet = (request, response) => {
    
        response.send('Test');
    
    }
}
```

Puis il faudra ajouter ce controller dans notre `server.ts` :

```typescript
import MonCtrl from "./src/controllers/rest/MonCtrl";

class Server {
    
    start() {
       // Il y a quelque chose à faire ici :)  
    }
}
```

### À faire

À partir des précédentes informations :

* Créer les dossiers nécessaires aux projets,
* Créer le `Router.ts`,
* Créer le controlleur `DocumentCtrl` dans le dossier controller 
et adapter le code fait dans l'exercice 2.
* Ajouter le DocumentCtrl à l'application Express dans `server.ts`.


> Correction : branche express-excercice-solution

---

[Suivant](https://github.com/Romakita/tp-nodejs/blob/master/express-ejs.md)