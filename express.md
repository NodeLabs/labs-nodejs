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

### Exercice

* Importer le module Express ([aide](https://github.com/Romakita/tp-nodejs/blob/master/aide-importation-module.md)),
* Créer une nouvelle instance Express,
* Ecouter le port 8080.

> Correction : branche express-install-solution

## Création d'un service Rest

