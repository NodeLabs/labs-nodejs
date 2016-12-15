# TP 5 - Express EJS - part2

L’objectif de ce TP est de créer un gestionnaire d’inscription à cours de Valtech Training comme présenté en capture ci-après :

![capture](https://github.com/Romakita/tp-nodejs/blob/master/src/training.png)

Les actions demandées sont les suivantes :

* Liste les participants à la session,
* Ajouter un participant,
* Modifier un participant,
* Supprimer un participant.

Ces actions auront les routes suivantes :

* GET /participants pour lister les participants,
* POST /participants pour ajouter un participants,
* GET /participants/:id pour supprimer un participant.

Pour pouvoir stocker les participants, nous utiliserons les middlewares pour 
Express.js dont les suivants :

* `body-parser` pour la gestion des paramètres envoyés en `POST`,
* `cookie-parser` pour la gestion des cookies,
* `express-session` pour la persistance des données dans un premier temps.

Les étapes à suivre sont les suivantes :

1. Ajouter les middlewares à notre serveur Express,
2. Créer le controlleur de page TrainingCtrl qui va prendre en charge l'affiche des pages trainings.html, training-inscription.html et training-participant.html,
3. Créer le formulaire d'inscription,
4. Créer les services Rest.

> Provided : [express-ejs-part2-provided](https://github.com/Romakita/tp-nodejs/tree/express-ejs-part2-provided)

**Le modèle participant**

```json
{
    lastName: "test",
    firstName: "firstName",
    email: "firstName@lastName.fr",
    course: "angular"
}
```

Voici un exemple pour créer une champs de saisie :
```html
<input id="lastName"
       name="lastName"
       type="text"
       class="validate"
       value="<%= maValue %>">

```

Pour construire la liste des cours :

```html
<option value="<%= course.value %>" 
        data-icon="/images/<%= course.icon %>"
        class="left circle"
        <%= course.value == participant.course ? 'selected' :'' %>>
        
        <%= course.label %>
</option>
```

[Suivant](https://github.com/Romakita/tp-nodejs/blob/master/express-ejs.md)