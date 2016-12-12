# TP 1 Installation de l'environnement

Les TP seront réalisés en TypeScript. Pour ce faire nous allons initialiser l’environnement afin d’avoir la compilation TypeScript sur nos fichiers sources.

## Prérequis

Vérifier que vous avez les éléments suivants d’installé sur votre poste :

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

Toujours dans le terminal lancez la commande suivante :

```
npm install -g typescript@2.0
tsc --init
```

> Nous travaillerons de préférence avec la version 2.0 de TypeScript

La commande `tsc --init` va créer un nouveau fichier `tsconfig.json`. Ce fichier contient les informations nécessaire 
au compilateur TypeScript pour compiler nos fichiers sources.

En l'état, il nous manque quelques options de compilation dans le `tsconfig.json`.

Voici les options à reporter dans votre `tsconfig.json`: 

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "es6",
      "dom",
      "es2015.collection"
    ],
    "types": [],
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


[Suivant]()