# TP 5 - Express EJS - part2

L’objectif de ce TP est de créer un gestionnaire d’inscription à cours de Valtech Training comme présenté en capture ci-après :

![capture](https://github.com/Romakita/tp-nodejs/blob/master/src/training.png)

#### Exerice 1

Nous allons cabler la page `training.html` que pouvez récupérer sur la branche [express-ejs-part2-provided](https://github.com/Romakita/tp-nodejs/tree/express-ejs-part2-provided).

Pour ce faire, nous allons créer un `TrainingCtrl` qui va gérer l'ensemble des pages de la section Training.

Ce contrôlleur va récupérer les données fournient dans le fichier `resources/courses.json`. Ces données vont nous permettre de créer 
une liste de formation.

Cette même liste de formation sera présenté à l'utilisateur afin qu'il puisse s'inscrire à cette dernnière.


#### Exercice 2

Maintenant nous allons nous occuper du formulaire d'inscription `training-inscription.html`.

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

### Exercice 3

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

[Suivant](https://github.com/Romakita/tp-nodejs/blob/master/express-ejs.md)