# Importation d'un module

## Node.js

En Node.js l'importation d'un module se fait avec l'instruction `require('module')`.

```javascript
var module = require('module');
```

## TypeScript/ES6

En TypeScript/ES6 l'importation d'un module Node.js peut se faire de la façon suivante :

#### Cas général

```typescript
import * as MonModule from "module";
```
Si il y a plusieurs fonction/classe/constante exportées dans le module source.

#### Import sélectif

```typescript
import {maFonction} from "module";
```

Si il y a plusieurs fonction/classe/constante exportées dans le module source
mais que l'on souhaite utiliser une fonction du module.

#### Importation par défaut

```typescript
import FonctionOuClassParDefaut from "module2"; // on récupère la fonction ou la classe exporté par défaut
```

Ne peut être utilisé que si le module utilise le mot clé `export default`. Exemple :

```typescript
// server.ts
export default class Server {
    
}

// app.ts
import Server from "./server";

new Server();
```
