# Introduction

Commençons par glaner à gauche et à droite les modules dont nous aurons besoin, nous voulons:

* un module pour faire du BDD
* un module pour faire du TDD
* un module pour la persistence de notre modèle, nous prendrons dans un 1er temps une base de données postgres
* un module pour effectuer des tâches asynchrones (~actor)
* un module pour générer les uuid de nos entités

## Preparation

### Installer **nodejs**

Voir [NodeJS](http://nodejs.org/) et [Installation](https://github.com/joyent/node/wiki/Installation).
Pour ma part, j'ai suivi le lien [precompiled package for MacOS](https://sites.google.com/site/nodejsmacosx/).

Assurons-nous que le simple "Hello world" marche:

```shell
    $ node -v
    v0.4.11
    $ echo "console.log('Hello World');" > hello.js
    $ node hello.js
    Hello World
    $ _
```

### Installer **Webworker** (for actor like)

[node-webworker](https://github.com/pgriess/node-webworker)

> A WebWorkers implementation for NodeJS

```shell
    $ npm install webworker
    webworker@0.8.4 ./node_modules/webworker
    $ _
```

### Installer **vows** (for BDD)
  
[VowsJS](http://vowsjs.org/)

> Asynchronous behaviour driven development for Node.
  
```shell
    $ npm install vows
    vows@0.5.11 ./node_modules/vows 
    └── eyes@0.1.6
    $ _
```

### Installer **nodeunit** (for TDD)

[nodeunit](https://github.com/caolan/nodeunit)

```shell
    $ npm install nodeunit
    nodeunit@0.5.5 ./node_modules/nodeunit 
    $ _ 
```

### Installer **node-postgres** (Non-blocking PostgreSQL client)

[node-postgres](https://github.com/brianc/node-postgres)

```shell
    $ npm install pg
    ...
    Checking for node prefix                 : ok /usr 
    Checking for program pg_config           : not found 
    .../node_modules/pg/wscript:16: error: The program ['pg_config'] is required
    pg@0.5.8 ./node_modules/pg 
    └── generic-pool@1.0.6
    $ _
```

  > In the mean time if you get a compilation failure during installation you
  > have still successfully installed the module; however, you cannot use the
  > native bindings -- only the pure javascript bindings.

Très bien, prenons ça pour argent comptant dans un premier temps, et nous nous contenterons de la version
pure javascript (qui devrait suffir amplement pour démarrer).

### Installer **node-uuid** (Generation de UUID de type 4)

[node-uuid](https://github.com/broofa/node-uuid)

```shell
   $ npm install node-uuid
   node-uuid@1.2.0 ./node_modules/node-uuid
   $ _
```

## Simplifions et centralisons les dépendences...

Installer toutes ces dépendances une à une devient rapidement fastidieux, surtout s'il faut le répéter à chaque fois
que le projet est récupérer depuis les sources. Heureusement, il existe un moyen de centraliser et conserver ces
dépendances en créant un fichier `package.json`. Ce fichier est très similaire au fichier `pom.xml` de Maven.
Il décrit de manière succinte l'appplication ainsi que ses dépendances.
Voir [Introduction To npm](http://howtonode.org/introduction-to-npm) pour plus d'information.

Par example:

```javascript
    {
      "author": "Arnauld",
      "name": "scrum-board",
      "description": "Scrum board: rambling around [D|T|B]DD",
      "version": "0.0.1",
      "repository": {
        "url": ""
      },
      "engines": {
        "node": "*"
      },
      "dependencies": {
        "webworker": "*",
        "vows": "*",
        "nodeunit": "*",
        "pg": "*",
        "node-uuid": "*"
      },
      "devDependencies": {},
      "main": "app.js"
    }
```

Du coup, la récupération des dépendances est beaucoup plus immédiate grâce à la commande `npm install`. 
Toutes les dépendances sont ainsi installées en une unique commande.

## Structure du projet

Le projet prendra la forme suivante:

    <project_dir>/
      +-- lib/
      |     +-- domain.js
      |     +-- event_store.js
      |     +-- repository.js
      |     +-- ...
      +-- node_modules/
      |     ...
      +-- samples/
      |     +-- hello.js
      |     +-- ...
      +-- specs/
      |     +-- project_specs.js
      |     +-- user_specs.js
      |     +-- ...
      +-- test/
      |     +-- user_test.js
      |     +-- domain_test.js
      |     +-- ...
      +-- package.json
      +-- watchr-conf.rb
      +-- ...

C'est à dire que

* dans `lib/` sera contenu le code de notre application
* dans `node_modules` les modules requis et installés pour NodeJS
* dans `samples/` des snippets et autres petits tests sans importance
* dans `specs` les tests fonctionnels (BDD)
* dans `test` les tests unitaires (TDD)

Tests des *specs*: executer tous les tests fonctionnels présents dans le dossier `specs/`

    node_modules/.bin/vows --spec specs/*

Tests unitaires: executer tous les tests unitaires présents dans le dossier `test/`

    node_modules/.bin/nodeunit test


## Test en continue

Préparons désormais notre environement de test de continue. Il s'agit de mettre en place des `jobs` qui seront
régulièrement déclenchés (sur modification d'un fichier par exemple). Il est ainsi possible de tester 
continuellement l'application, en relançant les tests à chaque fois qu'un fichier source est modifié.
Lorsque notre base de tests commencera à être conséquente, nous essaierons alors de rendre le mécanisme un peu
plus malin afin de ne pas pénaliser notre environement en lançant l'intégralité des tests à chaque changement.

Parmis ces `jobs` nous allons aussi mettre en place un outil de vérification de syntaxe. L'execution du javascript
étant relativement permissive dans certains environements d'execution, nous aurons ainsi une syntaxe plus propre,
et plus portable. Cette vérification sera faite via la bibliothèque `jslint`.

L'outils que nous allons utilisé est un script Ruby appellé [`watchr`][watchr]. Il permet de brancher des appels de 
fonctions à chaque fois qu'un fichier *surveillé* est modifié. La liste des fichiers surveillés est déterminée
par une expression régulière.

Installation de [`watchr`][watchr] (sous entend que ruby et rubygem soit correctement installé)

[watchr]:https://github.com/mynyml/watchr

    gem install watchr
    gem install ruby-fsevent 

Installation de jslint (module NodeJS) afin de tester en continue la syntaxe javascript;

    npm install jslint

Le fichier de configuration de `watchr` indique:
* que nous surveillons tous les fichiers `js` du dossier `lib` et pour chacun d'eux, en cas de modification,
  nous déclenchons l'execution du program `jslint` sur le fichier détecté, lançons les tests unitaires,
  et les tests fonctionels.
* que nous surveillons tous les fichiers `js` du dossier `test` et pour chacun d'eux, 
  en cas de modification, nous vérifions sa syntaxe et déclenchons l'execution de tous tests.
* que nous surveillons tous les fichiers `js` du dossier `specs` et pour chacun d'eux, 
  en cas de modification, nous vérifions sa syntaxe et déclenchons l'execution des tests fonctionnels.

`watchr-conf.rb`

```ruby
    watch('^(lib/(.*)\.js)') do |m|
      jslint_check("#{m[1]}")
      test()
      specs()
    end

    watch('^(test/(.*)\.js)') do |m|
      jslint_check("#{m[1]}")
      test()
    end

    watch('^(specs/(.*)\.js)') do |m|
      jslint_check("#{m[1]}")
      specs()
    end

    def jslint_check(files_to_check)
      #system('clear')
      puts "Checking #{files_to_check}"
      system("node_modules/.bin/jslint #{files_to_check}")
    end

    def test()
      puts "Start tests"
      system("node_modules/.bin/nodeunit test")
    end

    def specs()
      puts "Start behavior tests"
      system("node_modules/.bin/vows --spec specs/*")
    end
```

start watchr:

    watchr watchr-conf.rb

Pour plus de détails, je vous invite à consulter le livre [Continuous Testing][continuous-testing] qui -
même s'il traite essentiellement de Ruby, Rails et Javascript - donnent de bonne idées pour l'étendre à 
d'autres technologies.

[continuous-testing]:http://pragprog.com/book/rcctr/continuous-testing

# Un démarrage en douceur

Dans une console, démarrons notre script de test continu `watchr watchr-conf.rb`.

Commençons par le test fonctionnel de création d'un projet, nous voulons que la création d'un projet:

* retourne un objet de type `Project`
* retourne un projet dont le nom est bien celui fournit

`specs/project_specs.js`

```js
  var vows = require('vows'),
      assert = require('assert');

  var domain = require('../lib/domain')

  vows.describe('Project').addBatch({
      'A new project created with a given name': {
          topic: function () { 
              return domain.create_project("mccallum")
          },

          'should return an instance of Project' : function(project) {
              assert.instanceOf (project, domain.Project);
          },

          'should have the specified name': function (project) {
              assert.equal (project.name(), 'mccallum');
          },
      }
  }).export(module); // Export the Suite
```

Après la sauvegarde, on obtient la sortie suivante sur la console:

```
  Checking specs/project_specs.js

  specs/project_specs.js
  /*jslint node: true, es5: true */
    1 4,39: Expected ';' and instead saw 'vows'.
      var domain = require('../lib/domain')
    2 9,53: Expected ';' and instead saw '}'.
      return domain.create_project("mccallum")
  Start behavior tests

  node.js:134
          throw e; // process.nextTick error, or 'error' event on first tick
          ^
  Error: Cannot find module '../lib/domain'
      at Function._resolveFilename (module.js:317:11)
      at Function._load (module.js:262:25)
      at require (module.js:346:19)

```

On remarquera que notre javascript n'est pas tout à fait valide et qu'il manque deux `;` aux lignes 4 et 9.
Par ailleurs, nos tests échouent dû à l'absence de notre fichier `lib/domain.js`, ce qui est normal puisque
nous ne l'avons pas encore écrit!

Après quelques tatonements (comment fait-on l'[OOP en javascript][]...), on obtient le fichier suivant:

[OOP en javascript]:https://developer.mozilla.org/en/Introduction_to_Object-Oriented_JavaScript

`lib/domain.js`

```js
  /**
   *  Project
   */
  var Project = function(project_name) {
    this._name = project_name;
  };

  exports.create_project = function(project_name) {
    return new Project(project_name);
  };

  // tells nodeJS to make the `Project` visible from outside this file
  // when using `require`
  exports.Project = Project
```

Après sauvegarde:

```
  Checking lib/domain.js

  lib/domain.js
  /*jslint node: true, es5: true */
    1 12,26: Expected ';' and instead saw '(end)'.
      exports.Project = Project

  Start tests

  Start behavior tests

  ♢ Project

    A new project created with a given name
      ✓ should return an instance of Project
      ✗ should have the specified name
      TypeError: Object [object Object] has no method 'name'
      at Object.<anonymous> (/Users/arnauld/Projects/cqrs-ramblings/node-app/specs/project_specs.js:17:35)
      at runTest (/Users/arnauld/Projects/cqrs-ramblings/node-app/node_modules/vows/lib/vows.js:93:26)
      at EventEmitter.<anonymous> (/Users/arnauld/Projects/cqrs-ramblings/node-app/node_modules/vows/lib/vows.js:71:9)
      at EventEmitter.emit (events.js:81:20)
      at Array.0 (/Users/arnauld/Projects/cqrs-ramblings/node-app/node_modules/vows/lib/vows/suite.js:150:58)
      at EventEmitter._tickCallback (node.js:126:26)
   
  ✗ Errored » 1 honored ∙ 1 errored (0.008s)
```

Un de nos tests fonctionnel passe et l'autre échoue lamentablement.
Le projet créé est bien une instance de `Projet` en revanche il ne dispose pas de la méthode `name` qui devrait
permettre de renvoyer son nom. Fixons encore une fois le `;` qui manque, et rajoutons la méthode manquante.


`lib/domain.js`

```js
  Project.prototype = {
    name : function () { return this._name; }
  };
```

Nous obtenons finalement la sortie suivante:

```
  Checking lib/domain.js

  lib/domain.js
  /*jslint node: true, es5: true */
  No errors found.

  Start tests

  Start behavior tests

  ♢ Project

    A new project created with a given name
      ✓ should return an instance of Project
      ✓ should have the specified name
   
  ✓ OK » 2 honored (0.006s)
```

Hourra!!

Je passe rapidement sur la génération automatique d'un `uuid` pour notre projet (nous utilisons pour cela
le module `node-uuid` qui fournit, via la variable uuid definie par le `require`, une méthode de génération), 
et notre code ressemble désormais à:

`lib/domain.js`

```js
  var uuid = require('node-uuid');

  /**
   *  Project
   */
  var Project = function(uuid, project_name) {
    this._name = project_name;
    this._uuid = uuid;
  };

  // *public* methods
  Project.prototype = {
    name : function () { return this._name; },
    uuid : function () { return this._uuid; }
  };

  exports.create_project = function(project_name) {
    var generated_id = uuid(); // ask `node-uuid` to generate a new one
    return new Project(, project_name);
  };

  exports.Project = Project;
```

Des tests unitaires ont été ajoutés avant chaque ajout de méthode sur notre `classe` `Project` et ressemble
désormais à:

`test/project_test.js`

```
  var domain = require("../lib/domain");

  var UUID_PATTERN = /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{8}/;

  exports["create_project return the specified name"] = function (test) {
    var project = domain.create_project("mccallum");
    test.equal(project.name(), "mccallum");
    test.done();
  };

  exports["create_project generate a valid uuid"] = function (test) {
    var project = domain.create_project("mccallum");
    test.equal(UUID_PATTERN.test(project.uuid()), true);
    test.done();
  };
```

Notre fichiers de tests fonctionnels c'est aussi enrichi de quelques assertions supplémentaires notament
sur l'unicité de notre `uuid` et sa représentation:

`specs/project_specs.js`

```js
  var vows = require('vows'),
      assert = require('assert');

  var domain = require('../lib/domain');

  var UUID_PATTERN = /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{8}/;

  vows.describe('Project').addBatch({
      'A new project created with a given name': {
          topic: function () {
              return domain.create_project("mccallum");
          },

          'should return an instance of Project' : function(project) {
              assert.instanceOf (project, domain.Project);
          },

          'should have the specified name': function (project) {
              assert.equal (project.name(), 'mccallum');
          },

          'and a generated uuid': function (project) {
              assert.equal(UUID_PATTERN.test(project.uuid()), true);
          }
      },
      'New projects': {
          topic: function () { 
              return [ domain.create_project("mccallum"), domain.create_project("mccallum")];
          },

          'should have differents uuid': function (result) {
              assert.notEqual (result[0].uuid(), result[1].uuid());
          }
      }
  }).export(module); // Export the Suite
```

Notre console affiche donc fièrement:

```
  Start tests
  --------------------------

  project_test
  ✔ create_project return the specified name
  ✔ create_project generate a valid uuid

  OK: 2 assertions (15ms)

  Start behavior tests
  --------------------------

  ♢ Project

    A new project created with a given name
      ✓ should return an instance of Project
      ✓ should have the specified name
      ✓ and a generated uuid
    New projects
      ✓ should have differents uuid
   
  ✓ OK » 4 honored (0.003s)
```

# Et l'Event Sourcing dans tout ça ??

Tout ça c'est bien mais ce n'est pas très conforme avec notre idée de l'[Event Sourcing][event-sourcing].
En effet, la création du projet consiste bien en une transition d'état de *rien* vers *un nouveau projet*,
et nous ne conservons aucune données de cette transition. Qui plus est, le projet est porteur de son état,
il n'est donc pas possible de suivre les modifications qu'il subit, comme un changement de nom.

Rajoutons donc un évènement `ProjectCreated`, cet évènement sera porteur du nom du projet. Mais que devient
notre `uuid` ? sa valeur est portée par le projet, et nous souhaitons qu'un projet puisse être reconstruit
uniquement à partir de ses évènements. Nous déplaçons donc la génération du `uuid` et considérons que celui-ci
est un attribut de notre évènement.

Commençons par écrire les tests unitaires qui décrivent ce que nous souhaitons:

`test/project_test.js`

```js
  ...
  exports["create_project must generate an event of type 'project_created' in history"] = function (test) {
    var project = domain.create_project("mccallum");

    var events = project.events();
    test.ok(events instanceof Array);
    test.equal(events.length, 1);
    test.equal(events[0].event_type(), "project_created");
    test.done();
  };
```

Et la console nous affiche un échec dû à l'absence de notre méthode `events()` utilisée pour récupérer l'historique:

```
  Checking test/project_test.js
  --------------------------

  test/project_test.js
  /*jslint node: true, es5: true */
  No errors found.

  Start tests
  --------------------------

  project_test
  ✔ create_project return the specified name
  ✔ create_project generate a valid uuid
  ✖ create_project must generate an event of type 'project_created' in history

  TypeError: Object #<Object> has no method 'events'
      at /Users/arnauld/Projects/cqrs-ramblings/node-app/test/project_test.js:20:26
      ...
```


Après quelques cycles (red+green+refactor) où nous rajoutons la méthode `events` qui renvoie systématiquement un 
tableau vide, puis un objet bidon. 

Notre fichier de tests resemblent à:

```js
  ...
  exports["a new project must have an `events` method to retrieve its history"] = function (test) {
    var project = domain.create_project("mccallum");

    var events = project.events();
    test.ok(events instanceof Array);
    test.done();
  };
  exports["a new project must have a single `event` in its history"] = function (test) {
    var project = domain.create_project("mccallum");

    var events = project.events();
    test.ok(events instanceof Array);
    test.equal(events.length, 1);
    test.done();
  };
  exports["a new project must have a single `event` in its history of type 'project_created'"] = function (test) {
    var project = domain.create_project("mccallum");

    var events = project.events();
    test.ok(events instanceof Array);
    test.equal(events.length, 1);
    test.equal(events[0].event_type(), "project_created");
    test.done();
  };
```

Et notre console affiche désormais que nous bloquons désormais sur le type de notre évènement.

```
  Start tests
  --------------------------

  project_test
  ✔ create_project return the specified name
  ✔ create_project generate a valid uuid
  ✔ a new project must have an `events` method to retrieve its history
  ✔ a new project must have a single `event` in its history
  ✖ a new project must have a single `event` in its history of type 'project_created'

  TypeError: Object dummy_event has no method 'event_type'
      at /Users/arnauld/Projects/cqrs-ramblings/node-app/test/project_test.js:38:23
  ...  
  FAILURES: 1/8 assertions failed (11ms)
```


Modifions notre méthode de création de projet en passant non plus le nom et l'identifiant du projet mais l'évènement
souhaité. Dans la foulée nous rajoutons la méthode `apply` qui va appliquer cet évènement à notre projet. De la même
manière que si l'on rejouait l'historique du projet.
Notre code ressemble désormais à (je passe toutes les petites galères de syntaxes javascript, jslint étant là pour
me rappeller à l'ordre à chaque sauvegarde):

`lib/domain.js`

```
  var uuid = require('node-uuid');

  /**
   *  Project
   */

  var ProjectCreated = function(project_id, project_name) {
    // wrapping functions to make values *immutables*
    this.event_type   = function() { return "project_created"; };
    this.project_name = function() { return project_name; };
    this.project_id   = function() { return project_id;   };
  };

  var Project = function(project_id, project_name) {
    this.apply(new ProjectCreated(project_id, project_name));
  };

  // public method
  Project.prototype = {
    name : function () { return this._name; },
    uuid : function () { return this._uuid; },
    events: function () { return ["dummy_event"]; },
    apply: function (event) {
      switch(event.event_type()) {
        case "project_created" :
          this._name = event.project_name();
          this._uuid = event.project_id();
          break;
        default:
          throw new Error("Unknown event type: " + event.event_type());
      }
    }
  };

  exports.create_project = function(project_name) {
    return new Project(uuid(), project_name);
  };

  exports.Project = Project;
```

Après sauvegarde, on vérifie que les tests précédents continuent de fonctionner correctement, même
après notre refactoring.
Hourra!! même nos tests fonctionnels continuent de passer. 

```
  Start behavior tests
  --------------------------

  ♢ Project

    A new project created with a given name
      ✓ should return an instance of Project
      ✓ should have the specified name
      ✓ and a generated uuid
    New projects
      ✓ should have differents uuid
   
  ✓ OK » 4 honored (0.002s)
```

Nous avons toujours le même test unitaire qui ne passe pas puisque nous n'avons pas modifié la gestion de
l'historique encore.

Ajoutons désormais l'historique à notre projet.
Et tous nos tests passent! un peu de refactoring et voila finalement notre code:

`lib/domain.js`

```js
  ...
  // public method
  Project.prototype = {
    name : function () { return this._name; },
    uuid : function () { return this._uuid; },
    events: function () { return this._events; }
    apply: function (event) {
      switch(event.event_type()) {
        case "project_created" :
          this._name = event.project_name();
          this._uuid = event.project_id();
          break;
        default:
          throw new Error("Unknown event type: " + event.event_type());
      }

      // still there means the event was correctly handled, thus keep it!
      if(typeof this._events === 'undefined') {
        this._events = [];
      }
      this._events[this._events.length] = event;
    }
  };
```

Restons sur un succès, et arrêtons nous là pour aujourd'hui.

Dans notre prochain article, nous généraliserons la gestion de l'historique afin de pouvoir la réutiliser
dans nos autres entités. Nous nous inspirerons du design des `AggregateRoot` tel que généralement décrit dans 
les articles autours `cqrs` et dans [Super Simple CQRS Example - github](http://github.com/gregoryyoung/m-r).
Pour plus d'information, je vous invite à consulter les liens [ici](http://technbolts.tumblr.com/post/11317032794).
Enfin nous mettrons en place la reconstruction du projet par son historique.

