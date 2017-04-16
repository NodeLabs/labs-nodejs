# TP 4 
> Templating avec EJS

Le TP 3 nous a permis de nous familiariser avec Express et la création de route statique et dynamique.
Nous allons maintenant construire un site web et mettre en place la partie Front de notre application.

### Installation

Lancez la commande suivante :

```bash
npm install --save ejs serve-static morgan
```

### Bower

Bower est un gestionnaire de dépendance pour les packages Front-End (jQuery, Angular, etc...).
Il s'utilise de même façon que NPM, c'est-à-dire, en ligne de commande.

Commençons par installer `Bower`:
```bash
npm install -g bower
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
bower install --save lodash jquery materialize angular
```

Vous devez ensuite récupérer le dossier `/webapp` et son contenu. Puis copier le répertoire à la racine du projet.

> Sources du TP : #resources-tp4-installation-provided

### Configuration du serveur

Commençons par configurer le logger morgan. Il va nous logger toutes les requêtes adressées à notre serveur dans la console.

```typescript
class Server {

    public importMiddlewares(){
        const morgan = require('morgan');
        
        this.app.use(morgan('combined'));
    }
}
```
> `combined` est une option permettant d'avoir une log détaillée.

### Exercice 1

De la même façon qu'avec le logger morgan, ajoutez le middleware
[serve-static](https://github.com/expressjs/serve-static) à votre serveur pour 
exposer les contenus statiques du dossier `/webapp`.

> Pour valider l'installation du middleware, essayez d'acceder à une image du dossier webapp via 
le navigateur.

### Configuration du moteur de template EJS

> EJS est des moteurs de templating pour Node.js et Express.

Afin de pouvoir utiliser EJS nous devons configurer notre serveur comme suivant :

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

Le moteur de template fonctionne. Nous allons le tester. 

Actuellement dans le dossier `webapp`, vous avez une page `index.html`.
Cette page est incomplète et il nous manque le `header.html` 
et le `footer.html`.

Commencez donc par inclure le `header.html` avec une instruction EJS ([doc](http://ejs.co/)).

Ensuite essayez d'afficher la page.

### Exercice 3

Pour résoudre le problème de l'exercice 2, il faut en réalité créer un controller nommé 
`IndexCtrl` dans le dossier `src/pages` et indiquer explicitement à Express
que pour la page `index.html` ayant la route `/` il y une phase de rendu ou `render` 
à effectuer. Voici les étapes à suivre :

* Créez l'`IndexCtrl` comme nous l'avions fait pour le service Rest.
* Créez une nouvelle route pour la page index et utilisez la methode `response.render()`.

Une fois que votre controlleur est en place vous devriez avoir l'entête de site disponible.

Vous pouvez inclure le footer !

> Note : Faite attention à l'ordre des middlewares !

### Exercice 4

Maintenant nous allons proposer une page d'accueil avec un peu de contenu sous forme de carte !

Voici un fragment html pour vous aider à faire cette exercice :

```html
<div class="card">
    <div class="card-image waves-effect waves-block waves-light">
        <img class="activator" src="images/">
    </div>
    <div class="card-content">
        <span class="card-title activator grey-text text-darken-4">
            label <i class="material-icons right">more_vert</i>
        </span>

        <p><a href="">Y aller !</a></p>
    </div>

    <div class="card-reveal">
        <span class="card-title grey-text text-darken-4">
            label <i class="material-icons right">fermer</i>
        </span>
        <p>description</p>
    </div>
</div>
```

Nous avons dans le dossier `resources` un fichier `menu.json`. Nous allons utiliser 
ce fichier pour créer une liste de carte dans la page d'accueil.

> Note : response.render() prend deux paramètres, le premier étant le nom de la page
 html et le second étant des données (scope) pour générer notre vue.

En utilisant les bonnes instructions EJS, essayez d'afficher la liste de carte. 

**Bonus**

Il y a un bouton de téléchargement dans la page d'accueil. Essayez de le relier avec le service Rest `document`.

**Bonus 2**
Le `header.html` doit afficher un menu de navigation (mobile et desktop). 
Voici le fragment html pour vous aider :

```html                   
<li><a href="lien">label</a></li>
```

> Correction : #resources-tp4-exercice-4-solution

[Suivant](tp5-express-middlewares-form-services.md)