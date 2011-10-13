###

Un peu de refactoring pour s'échauffer. Le fichier `lib/domain.js` est renomé en `lib.project.js`,
et la fonction `create_project` en `create` puisque le fichier sera dédié à notre classe projet.

Il est alors nécessaire de modifier dans les fichiers `specs/project_specs.js` et
`test/project_test.js` en modifiant `var domain = require('../lib/domain')` par
`var prj = require('../lib/project')` et tout les appels de méthode `domain.create_project`
 par `prj.create`.

### Renommer un projet

Afin de completer un peu notre projet ajoutons une méthode `rename` afin de pouvoir modifier le nom
de notre projet. Successivement nous:

* ajoutons le test suivant (`test/project_test.js`)
  
  ```js
    exports["renaming a project must change its name according to new one"] = function (test) {
        var project = prj.create("mccallum");
        project.rename("travis");
        test.equal(project.name(), "travis");
        test.done();
    };
  ```

* vérifions que notre test échoue à cause de l'absence de la méthode
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

Bon, nous avons désormais deux types d'évènements différents. Interessons-nous à la reconstruction
d'un projet à partir de ses évènements, rappellez-vous l'Event sourcing!

### Projet et Event Sourcing

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

Rajontons progressivement la méthode `loadFromHistory` sur notre module et sur notre classe `Projet`.
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

