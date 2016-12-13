# TP 3 - Express

* Installation
* Création du server
* Exposer un document via un service Rest

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
> Nous allons réutiliser la tâche npm `tsc:w` pour la combiner avec `concurrently` et `nodemon`. 

## Création du server

