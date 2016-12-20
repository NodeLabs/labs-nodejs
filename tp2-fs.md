# TP 2 FileSystem & Events

L'objectif de ce TP est d'afficher le contenu d'un fichier situer dans une dossier `resources` dans la console Node.js.

> Par la suite nous réutiliserons se script pour afficher un document dans un navigateur.

### Prérequis

 * Commencez par créer un fichier `app.ts` à la racine de votre projet.
 * Créez un dossiers `src`. Nous y mettrons tous nos sources.
 * Créez le fichier `src/utils/FileUtils.ts`.
 * Créez un dossier `resources`. Nous y mettrons tous les documents dans ce dossier.
 
> Vous pouvez récupérer les resources sur la branche [https://github.com/Romakita/tp-nodejs/tree/tp2-provided](https://github.com/Romakita/tp-nodejs/tree/tp2-provided)

### Activer le sourceMapping

Le source mapping permet de mapper les lignes d'un fichier compilé avec les lignes de son fichier source. 
Pratique si nous faisons du TypeScript et encore plus si nous souhaitons débugger du code.

Pour rendre cela possible nous avons installé le module `source-map-support`.

Il nous faut cependant ajouter une ligne de code dans le `app.ts` pour que ce module puisse
`patcher` la console Node.js.

Dans le fichier `app.ts` ajouter en debut de fichier la ligne suivante :

```typescript
require('source-map-support').install();

/// notre code TypeScript
console.error('TEST');
```

### Exercice 1

Nous allons implémenter les différentes étapes nécessaires à la lecture d'un fichier en Node.js.

Vous pouvez l'écrire de la façon que vous voulez (Classe ES6/TypeScript ou en fonction).

L'important ici est de comprendre les notions suivantes :

* La programmation Asynchrone et ses problématiques,
* L'exportation de classe ou de fonction,
* L'importation d'une module,
* Créer un module node.

#### Les methodes / fonctions à implémenter

Notre module FileUtils exposera la méthode `read()`. Elle nous permettra de lire 
le fichier, mais pour lire un fichier il faut d'abord faire implémenter 
les méthodes suivantes :

* [`stats()`](https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_fs_stat_path_callback): Récupère les statistiques du fichier,
* [`open()`](https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_fs_open_path_flags_mode_callback): Ouvre un flux sur un fichier,
* [`readFile`()](https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback): Créer le buffer, lit le fichier en fonction du flux et retourne le contenu.

> Pour vous aider la documentation : [https://nodejs.org/dist/latest-v6.x/docs/api/fs.html](https://nodejs.org/dist/latest-v6.x/docs/api/fs.html)

#### Exemple en classe

```
new FileUtils("document.txt")
   .read((content) => {
        console.log(content);
   });
```

#### Exemple en fonction

```
fileUtils.read("document.txt", function(content) {
    console.log(content);
});
```

### Exercice 2

Nous allons implémenter une autre approche de programmation qui est courrante de voir en Node.js, la programmation événementielle.

Pour l'instant nous avons utilisé ce que l'on appel une callback pour récupérer le contenu du fichier.

Nous allons maintenant utiliser le module [`events`](https://nodejs.org/dist/latest-v6.x/docs/api/events.html) et notre méthode read devra fonctionner ainsi :

#### Exemple en classe

```
new FileUtils("document.txt")
   .read((content) => {
        console.log(content);
   });
   
// ou
   
const file = new FileUtils("document2.txt");   
file.on('success', (content) => {
   console.log(content);
});
```

#### Exemple en fonction

```
fileUtils.read("document.txt", function(content) {
    console.log(content);
});

// ou

const file = fileUtils.read("document.txt");

file.on('success', (content) => {
   console.log(content);
});
```

> Pour vous aider la documentation : [https://nodejs.org/dist/latest-v6.x/docs/api/events.html](https://nodejs.org/dist/latest-v6.x/docs/api/events.html)

[Suivant](https://github.com/Romakita/tp-nodejs/blob/master/tp3-express.md)