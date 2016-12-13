# TP 4 - Express EJS

Le TP 3 nous a permit de nous familiarise avec Express et la création de route statique et dynamique.
Nous allons maintenant construire un site web et donc mettre en place la partie Front de notre application.

### Installation

Lancer la commande suivante :

```bash
npm install --save ejs serve-static morgan
```

### Bower

Bower est gestionnaire de dépendance pour les packages Front-End (jQuery, Angular, etc...).
Il s'utilise de même façon que NPM, c'est-à-dire, en ligne de commande.

Commençons par installer `Bower`:
```bash
npm install --save-dev bower
bower init
```

Etape suivante, il nous faut préciser le répertoire d'installation des `bower_components`.
Pour cela, il faut créer un fichier `.bowerrc` à la racine du projet et ajouter ceci :

```json
{
  "directory": "webapp/bower_components/"
}
```

On installe maintenant les packages que nous allons utiliser pour développer notre site :

```bash
bower install --save lodash jquery Materialize angular
```

Vous devez ensuite récupérer le dossier `/webapp` et son contenu. Vous pouvez récuperer le contenu dans 
la branche [express-ejs-installation-provided](https://github.com/Romakita/tp-nodejs/tree/express-ejs-installation-provided).

Copiez le répertoire à la racine du projet.

### Configuration du serveur

Commençons configurer le logger morgan. Elle va nous logger toutes les requêtes dans la console.

```typescript
class Server {

    public importMiddlewares(){
        const morgan = require('morgan');
        
        this.app.use(morgan('combined'));
    }
}
```
> `combined` est une option permettant d'avoir une log détaillé mais clair.

### Exercice 1

De la même façon qu'avec le logger morgan, ajouter le middleware
[serve-static](https://github.com/expressjs/serve-static) à votre serveur pour 
exposer les contenus statiques du dossier `/webapp`.

> Pour valider l'installation du middleware, essayé d'acceder à une image du dossier webapp via 
le navigateur.

### Configuration du moteur de template EJS

EJS comme vue dans le cours est des moteurs de templating pour Node.js et Express.

Afin de pouvoir l'utiliser nous devons configurer - encore une fois - notre serveur.

```typescript
class Server {

    public importMiddlewares(){
        
        /// ... configuration des premiers middlewares
        
        // On utilise l'extension .html en lieu et place de l'extension .ejs
        this.app.engine('.html', require('ejs').__express);

        // On change le dossier de base
        this.app.set('views', './webapp');

        // Permet de ne pas spécifier l'extension lors de l'utilisation de res.render()
        this.app.set('view engine', 'html');
        
    }
}
```

### Exercice 2

Le moteur de template fonctionne (à priori). Nous allons le tester. 

Actuellement dans le dossier webapp, vous avez une page `index.html`.
Cette page est incomplète et il nous manque en effet le `header.html` 
et le `footer.html`

Commencez donc par inclure le `header.html` avec une instruction EJS ([doc](http://ejs.co/)).

> Note : Si cela ne fonctionne pas c'est normal !

### Exercice 3

Pour résoudre le problème de l'exercice 2, il faut en réalité créer un controller nommé 
`IndexCtrl` dans le dossier `src/pages` et indiquer explicitement à Express
que pour la page index.html ayant la route `/` il y une phase de rendu ou `render` 
à effectuer.

Commencez donc par créer l'`IndexCtrl` comme nous l'avions fait pour le service Resst.

Ensuite créez une nouvelle route pour la page index et utilisez la methode `response.render()`.
