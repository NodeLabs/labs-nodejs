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

1. Créer notre module `ParticipantCtrl`,
2. Ajouter les middlewares à notre serveur Express,
3. Créer les pages partipants et la page du formulaire d'inscription,
4. Créer les routes permettant de gérer les actions.

[Suivant](https://github.com/Romakita/tp-nodejs/blob/master/express-ejs.md)