### Echauffement

Un peu de refactoring pour s'échauffer. 
Au liew de définir tout notre domaine dans le fichier `domain.js`, associons chaque élément de notre
domaine à un fichier spécifique:

* le fichier `lib/domain.js` est alors renomé en `lib.project.js`
* la fonction `create_project` en `create` puisque le fichier sera dédié à notre classe projet

Les corrections a apporté sont alors les suivantes dans les fichiers `specs/project_specs.js` et 
`test/project_test.js` :

* modifier `var domain = require('../lib/domain')` par `var prj = require('../lib/project')` 
* et tout les appels de méthode `domain.create_project` par `prj.create`

Relançons les tests, et oh miracle ils passent tous.

#### Renommer un projet

Afin de completer un peu notre projet ajoutons une méthode `rename` afin de pouvoir modifier le nom
de notre projet. On peux remarquer que l'intention est bien de **renomer** le projet et non pas de
définir son nom comme pourrait l'indiquer un 'setter' standard du type `set_name`.

Successivement nous:

* ajoutons le test suivant (`test/project_test.js`)
  
  ```js
    exports["renaming a project must change its name according to new one"] = function (test) {
        var project = prj.create("mccallum");
        project.rename("travis");
        test.equal(project.name(), "travis");
        test.done();
    };
  ```

* vérifions que notre test échoue à cause de l'absence de la méthode `rename`
* ajoutons ensuite la méthode `rename` sur notre project (`lib/project.js`)
  
  ```js
    // public method
    Project.prototype = {
        ...
        rename: function(new_name) {
            this._name = new_name;
        }
    };
  ```

* ajoutons le test indiquant que le changement de nom doit entrainer la création d'un nouvel évènement (`test/project_test.js`)
  
  ```js
    exports["renaming a project must add an `event` in its history of type 'project_renamed'"] = function (test) {
        var project = prj.create("mccallum");
        project.rename("travis");

        var events = project.events();
        test.ok(events instanceof Array);
        test.equal(events.length, 2);
        test.equal(events[0].event_type(), "project_created");
        test.equal(events[1].event_type(), "project_renamed");
        test.done();
    };
  ```

* vérifions que notre test échoue

* modifions finalement la méthode `rename` pour générer un nouvel évènement et sa gestion
  dans la méthode apply (`lib/project.js`)
  
  ```js
    var to_f = function(value) { 
        return function () { 
            return value; 
        }
    };
    ...
    var ProjectRenamed = function(project_id, new_project_name) {
        // wrapping functions to make values *immutables*
        this.event_type       = to_f("project_renamed");
        this.new_project_name = to_f(new_project_name);
        this.project_id       = to_f(project_id);
    };
    ...
    // public method
    Project.prototype = {
        name : function () { return this._name; },
        uuid : function () { return this._uuid; },
        events: function () { return this._events; },
        apply: function (event) {
            switch(event.event_type()) {
                case "project_created" :
                    this._name = event.project_name();
                    this._uuid = event.project_id();
                    break;
                case "project_renamed" :
                    this._name = event.new_project_name();
                    break;
                default:
                    throw new Error("Unknown event type: " + event.event_type());
            }

            // still there means, the event was correctly handled, thus keep it!
            if(typeof this._events === 'undefined') {
                this._events = [];
            }
            this._events[this._events.length] = event;
        },
        rename: function(new_name) {
            this.apply(new ProjectRenamed(this._uuid, new_name));   
        }
    };
  ```

#### Projet et Event Sourcing: le phoenix!

Bon, nous avons désormais deux types d'évènements différents. Interessons-nous à la reconstruction
d'un projet à partir de ses évènements, rappellez-vous l'Event sourcing! Faire renaître un projet
de ses cendres euh... de son historique!

Exportons les classes de nos deux évènements afin qu'elles soient disponibles depuis les autres
modules.

`lib/project.js`

```js
    exports.ProjectCreated = ProjectCreated;
    exports.ProjectRenamed = ProjectRenamed;
```

Le test correspondant à la relecture peut alors s'écrire:

`test/project_test.js`

```js
    exports["a project can be reload from a simple history"] = function (test) {
        var project_id = uuid();
        var history = [ 
            new prj.ProjectCreated(project_id, "mccallum"),
            new prj.ProjectRenamed(project_id, "travis")
        ];
        var project = prj.load_from_history(history);

        test.equal(project.name(), "travis");
        test.equal(project.uuid(), project_id);
        test.done();
    };
```

Rajoutons progressivement la méthode `load_from_history` sur notre module et sur notre classe `Projet`.
La méthode sur notre module servira de `factory`, dans un premier temps, pour créer un projet à partir 
de son historique.
Nous obtenons alors:

`lib/project.js`

```js
    // public method
    Project.prototype = {
        ...
        load_from_history: function(events) {
            var $this = this;
            events.forEach(function(event) {
                $this.apply(event);
            });
        },
        ...
    };
    
    ...
    
    exports.load_from_history = function(events) {
        var project = new Project();
        project.load_from_history(events);
        return project;
    };
```

Un coup d'oeil sur notre console, et hop tout le monde est vert, c'est pas géant ça?

Le code complet de `lib/project.js` est à ce stade:

`lib/project.js`

```js
    var uuid = require('node-uuid');

    var to_f = function(value) { 
        return function () { 
            return value; 
        };
    };

    /**
     *  Events
     */
    var ProjectCreated = function(project_id, project_name) {
        // wrapping functions to make values *immutables*
        this.event_type   = to_f("project_created");
        this.project_name = to_f(project_name);
        this.project_id   = to_f(project_id);
    };

    exports.ProjectCreated = ProjectCreated;

    var ProjectRenamed = function(project_id, new_project_name) {
        // wrapping functions to make values *immutables*
        this.event_type       = to_f("project_renamed");
        this.new_project_name = to_f(new_project_name);
        this.project_id       = to_f(project_id);
    };

    exports.ProjectRenamed = ProjectRenamed;

    /**
     *  Project
     */
    var Project = function(project_id, project_name) {
        this.apply(new ProjectCreated(project_id, project_name));
    };

    // public method
    Project.prototype = {
        name : function () { return this._name; },
        uuid : function () { return this._uuid; },
        events: function () { return this._events; },
        apply: function (event) {
            switch(event.event_type()) {
                case "project_created" :
                    this._name = event.project_name();
                    this._uuid = event.project_id();
                    break;
                case "project_renamed" :
                    this._name = event.new_project_name();
                    break;
                default:
                    throw new Error("Unknown event type: " + event.event_type());
            }

            // still there means, the event was correctly handled, thus keep it!
            if(typeof this._events === 'undefined') {
                this._events = [];
            }
            this._events[this._events.length] = event;
        },
        load_from_history: function(events) {
            var $this = this;
            events.forEach(function(event) {
                $this.apply(event);
            });
        },
        rename: function(new_name) {
            this.apply(new ProjectRenamed(this._uuid, new_name));   
        }
    };

    exports.create = function(project_name) {
        return new Project(uuid(), project_name);
    };

    exports.load_from_history = function(events) {
        var project = new Project();
        project.load_from_history(events);
        return project;
    };

    exports.Project = Project;
```

### Un peu de technique dans un monde de bruts!

Si l'on devait effectuer le même travail sur une autre entité de notre domaine - comme un `User` (qui décrit
un utilisateur de notre application: un `developer`, un `scrum master` ou encore un `product owner`) 
ou une `Story` -  on peux constater la redondance de code dans la gestion des évènements et de l'identifiant.

Nous allons donc nous interesser à généraliser ce code dans une classe (que l'on manipulera plus comme un
[`trait`](http://www.scala-lang.org/node/126) ou `mixin` compte-tenu de l'aspect dynamique du javascript) 
dédiée que l'on pourra étendre ensuite afin de bénéficier de cette infrastructure technique.

En regardant le code de gestion de l'évènement (méthode `apply`), on voit aussi que notre `switch` risque
de rapidement devenir in-maintenable et illisible. Commençons donc par utiliser l'aspect dynamique de javascript
pour retrouver une méthode succeptible de pouvoir gérer un évènement en fonction de son type.

Après quelques tatonements (voir les méthodes `apply` et `call` de javascript) et les tests aux verts, voici les
changements que nous avons faits:

* notre méthode `apply` a été renommé en `apply_event` pour éviter toute confusion avec la
  méthode `apply` de javascript.
* la fonction capable de gérer un évènement est récupérer à partir de son type via un tableau
  de fonction dont la clé de chaque élément correspondont aux types d'évènements: <br/>
  `var handler = this.event_handlers["on_"+event.event_type()];` <br/>
* le tableau des fonctions est définit comme suit: <br/>
  ```js
    event_handlers : {
            on_project_created: function(event) {
                this._name = event.project_name();
                this._uuid = event.project_id();
            },
            on_project_renamed: function(event) {
                this._name = event.new_project_name();
            }
        },
  ```
* la fonction ainsi récupérée est alors invoquée via la fonction `call` de javascript: <br/>
  `handler.call(this, event);`


Tout ceci nous amène finalement à:

```js
    /**
     *  Project
     */
    var Project = function(project_id, project_name) {
        this.applyEvent(new ProjectCreated(project_id, project_name));
    };

    // public method
    Project.prototype = {
        event_handlers : {
            on_project_created: function(event) {
                this._name = event.project_name();
                this._uuid = event.project_id();
            },
            on_project_renamed: function(event) {
                this._name = event.new_project_name();
            }
        },
        name  : function () { return this._name; },
        uuid  : function () { return this._uuid; },
        events: function () { return this._events; },
        applyEvent : function (event) {
            var handler = this.event_handlers["on_"+event.event_type()];
            if(typeof handler === 'undefined') {
                throw new Error("Unknown event type: <" + event.event_type() + ">");
            }
            handler.call(this, event);

            // still there means, the event was correctly handled, thus keep it!
            if(typeof this._events === 'undefined') {
                this._events = [];
            }
            this._events[this._events.length] = event;
        },
        load_from_history: function(events) {
            var $this = this;
            events.forEach(function(event) {
                $this.applyEvent(event);
            });
        },
        rename: function(new_name) {
            this.applyEvent(new ProjectRenamed(this._uuid, new_name));  
        }
    };
```
