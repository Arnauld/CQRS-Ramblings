# Introduction

Commençons par glaner à gauche et à droite les modules dont nous aurons besoin, nous voulons:

* un module pour faire du BDD
* un module pour faire du TDD
* un module pour la persistence de notre modèle, nous prendrons dans un 1er temps une base de données postgres
* un module pour effectuer des tâches asynchrones (~actor)
* un module pour générer les uuid de nos entités

## Preparation

### Installer **nodejs**

Assurons-nous que le simple "Hello world" marche:

```shell
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

Très bien, prenons ça pour argent comptant dans un premier temps.

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
et plus portable.

L'outils que nous allons utilisé est un script Ruby appellé [`watchr`][watchr]. Il permet de brancher des appels de 
fonctions à chaque fois qu'un fichier *surveillé* est modifié. La liste des fichiers surveillés est déterminée
par une expression régulière.

Installation de [`watchr`][watchr]

[watchr]:https://github.com/mynyml/watchr

    gem install watchr
    gem install ruby-fsevent 

Installation de jslint (module NodeJS) afin de tester en continue la syntaxe javascript;

    npm install jslint

Le fichier de configuration de `watchr` indique:
* que nous surveillons tous les fichiers `js` du dossier `lib` et pour chacun d'eux, en cas de modification,
  nous déclencherons l'execution du program `jslint` sur le fichier détecté, lançons les tests unitaires,
  et les tests fonctionels.
* que nous surveillons tous les fichiers `js` du dossier `test` et pour chacun d'eux, 
  en cas de modification, nous déclencherons l'execution des tests.
* que nous surveillons tous les fichiers `js` du dossier `specs` pour chacun d'eux, 
  en cas de modification, nous déclencherons l'execution des tests fonctionnels.

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


# Un démarrage en douceur

Dans une console, démarrons notre script de test continu `watchr watchr-conf.rb`.

Commençons par le test fonctionnel de création d'un projet:

`specs/project_specs.js`
```javascript
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

On remarquera que notre javascript n'est pas tout à fait valide et qu'il manque deux `;` lignes 4 et 9.
Nos tests échouent dû à l'absence de notre fichier `lib/domain.js`

`lib/domain.js`
```
/**
 *  Project
 */
var Project = function(project_name) {
  this._name = project_name;
};

exports.create_project = function(project_name) {
  return new Project(project_name);
};

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
    at Object.<anonymous> (/Users/arnauld/Projects/cqrs-ramblings/node-app/specs/project_specs2.js:17:35)
    at runTest (/Users/arnauld/Projects/cqrs-ramblings/node-app/node_modules/vows/lib/vows.js:93:26)
    at EventEmitter.<anonymous> (/Users/arnauld/Projects/cqrs-ramblings/node-app/node_modules/vows/lib/vows.js:71:9)
    at EventEmitter.emit (events.js:81:20)
    at Array.0 (/Users/arnauld/Projects/cqrs-ramblings/node-app/node_modules/vows/lib/vows/suite.js:150:58)
    at EventEmitter._tickCallback (node.js:126:26)
 
✗ Errored » 1 honored ∙ 1 errored (0.008s)
```

Le projet créé est bien une instance de `Projet` en revanche il ne dispose pas de la méthode `name` qui devrait
permettre de renvoyer son nom. Fixons encore une fois le `;` qui manque, et rajoutons la méthode manquante.

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


