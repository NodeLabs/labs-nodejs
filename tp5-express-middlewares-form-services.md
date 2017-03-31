# TP 5 - Middlewares, Formulaire & Services

L’objectif de ce TP est de créer un gestionnaire d’inscription à cours de Valtech Training comme présenté en capture ci-après :

![capture](https://github.com/NodeAndTyped/labs-nodejs/blob/master/src/training.png)

## Exercice 1

Avant de commencer à coder les nouvelles pages nous allons créer un middleware pour que nous n'ayons pas à
ajouter le `menu.json` dans chaque controlleur de page que nous allons créer.

Dans le `server.ts` nous allons rajouter la méthode suivante :

```typescript
class Server {
    
    private middlewareMenu(response, request, next) {
        
        response.locals = {
            menu: require('./resources/menu.json'),
            navClass: ''
        };
        
        next();
    }
}
```
> locals est une variable globale d'Express. Elle permet d'y stocker des informations partagées au niveau d'un template.

Ensuite ajoutez ce middleware au bon endroit dans la méthode `importMiddlewares()` de la même façon
que lorsque vous avez ajouté un middleware à Express.

## Exercice 2

Nous allons cabler la page `training.html` que vous pouvez récupérer depuis les sources du [tp5-provided](https://github.com/NodeAndTyped/labs-nodejs/tree/tp5-provided).

Pour ce faire, nous allons créer un `TrainingCtrl` qui va gérer l'ensemble des pages de la section Training.

Ce contrôlleur va récupérer les données fournies dans le fichier `resources/courses.json`. Ces données vont nous permettre de créer 
une liste de formation.

Cette même liste de formation sera présenté à l'utilisateur afin qu'il puisse s'inscrire à cette dernnière.

## Exercice 3

Maintenant nous allons nous occuper du formulaire d'inscription `training-inscription.html`.

Il vous faut donc créer la nouvelle route pour accéder à la page `training-inscription.html` et 
renvoyer une réponse dont voici l'exemple :

```typescript

class TrainingCtrl extends Router {
    
    constructor() {
        // ...
    }
    
    private renderTrainingRegister = (request, response) => {
        
        response.render('training-inscription', {
              courses: require('../../../resources/courses.json'),
              participant: {
                  _id: '',
                  firstName: '',
                  lastName: '',
                  email: '',
                  course: request.params.course
              }
          });  
    }
  
}


```

Pour ce formulaire, il faudra créer les bons champs de saisie en fonction du modèle de données suivants :

```json
{
    "lastName": "test",
    "firstName": "firstName",
    "email": "firstName@lastName.fr",
    "course": "angular"
}
```
> Il y a donc 4 champs à fournir dont course etant un liste déroulante.

Voici un exemple pour créer une champs de saisie :
```html
<input id="lastName"
       name="lastName"
       type="text"
       class="validate"
       value="<%= maValue %>">
```

Et un autre exemple pour construire une ligne de la liste des formations :

```html
<option value="<%= course.value %>" 
        data-icon="/images/<%= course.icon %>"
        class="left circle"
        <%= course.value == participant.course ? 'selected' :'' %>>
        
    <%= course.label %>
</option>
```

## Exercice 4

Votre formulaire est prêt, nous allons maintenant exposer des services Rest pour créer un participant.

Les actions demandées sont les suivantes :

* Liste les participants à la session,
* Ajouter un participant,
* Modifier un participant,
* Supprimer un participant.

Ces actions auront les routes suivantes :

* GET /participants pour lister les participants,
* POST /participants pour ajouter un participant,
* PUT /participants/:id pour mettre à jour un participant,
* DELETE /participants/:id pour supprimer un participant.


#### Installation

Nous allons installer quelques middlewares pour gérer les données :

* [`body-parser`](https://github.com/expressjs/body-parser) pour la gestion des paramètres envoyés en `POST`
* [`method-override`](https://github.com/expressjs/method-override) pour gérer les verbs du protocol HTML.

#### Travail à faire

Nous allons créer un nouveau controlleur ParticipantCtrl pour gérer les actions demandées.

Enfin pour persister les données dans un premier temps nous utiliserons un ParticipantsService que allons 
développer dans le dossier `src/services`.

Ce service doit permettre d'ajouter / modifier / lister / supprimer un participant.

[Suivant](https://github.com/NodeAndTyped/labs-nodejs/blob/master/tp6-socketio.md)