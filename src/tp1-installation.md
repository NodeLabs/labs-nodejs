# TP 1
> Installation de l'environnement

Les TP seront réalisés en TypeScript. Vous n'êtes cependant pas obligé d'écrire votre code en TypeScript pure. 
Vous pouvez tout à fait écrire votre code en JavaScript standard dans un fichier TypeScript ou JavaScript en ES6.

L'important ici est de se familiariser avec le standard EcmaScript 6 et pour les plus motivés avec TypeScript.

## Prérequis

Vérifiez que vous avez les éléments suivants d’installés sur votre poste :

* Node v6 ou plus avec la commande npm –v,
* Git, nous l’utiliserons pour récupérer le projet initial,
* Webstorm (ou un autre IDE)

## Installation
### Initialisation du projet

Créez un nouveau projet dans votre IDE. Puis dans le terminal, placez-vous sur votre nouveau projet et lancez la commande suivante :

```bash
npm init
```

> Suivez le guide d'initialisation de la commande.

### Installation des modules

Maintenant nous allons installer les modules nécessaires à un projet TypeScript.

Toujours dans le terminal, lancez la commande suivante :

```
npm install -g typescript@2
npm install --save-dev @types/node
npm install --save source-map-support
tsc --init
```
> source-map-support ajoute le sourceMapping entre le code source TypeScript et le code source compilé. Pratique pour débugger une erreur.

La commande `tsc --init` va créer un nouveau fichier `tsconfig.json`. Ce fichier contient les informations nécessaires
au compilateur TypeScript pour transpiler nos fichiers sources.

En l'état, il nous manque quelques options de compilation dans le `tsconfig.json`.

Voici les options à reporter dans votre `tsconfig.json`: 

```json
{
  "compilerOptions": {
    "target": "es6",
    "lib": [
      "es6",
      "dom",
      "es2015.collection"
    ],
    "typeRoots": "./node_modules/@types",
    "module": "commonjs",
    "moduleResolution": "node",
    "sourceMap": true,
    "declaration": false
  },
  "exclude": [
    "node_modules"
  ]
}
```

> Votre projet est prêt pour compiler du TypeScript

En complément, et pour vous simplifier la vie, vous pouvez éditer le `package.json` 
et ajouter les tâches suivantes :

```json
{
   "scripts": {
      "tsc": "tsc",
      "tsc:w": "tsc -w"
   }
}
```

Ces tâches peuvent être exécuter en ligne de commande ou par votre IDE comme suivant :

```bash
npm run tsc:w
```
> Cette commande permet de recompiler les fichiers TypeScript dès qu'ils seront modifiés.

[Suivant](tp2-file-system-et-events.md)