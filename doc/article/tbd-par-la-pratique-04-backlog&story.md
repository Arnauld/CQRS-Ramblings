### Backlog et Story


Le `backlog` est directement lié au projet par une relation 1-1: le backlog appartient à un projet
et un projet n'a qu'un backlog. D'un certain point de vue, le backlog existe fonctionnellement, mais
créé une entité dédiée n'apporte, à ce stade, pas grand chose: il s'agit plus d'un concept que l'on
qualifiera d'affichage qu'un besoin de persistence. Nous nous passerons donc de définir une entité
dédiée au backlog.

En revanche, une `story` joue un rôle centrale dans notre application. Les discussions de travail
seront souvent centrées autour d'une `story` particulère, bien identifiée par son nom et sa
description. Et même si une `story` appartient à un projet, nous considérerons plutôt qu'elle est liée
à celui-ci, et qu'elle constitue une entité à part entière.

Rappelez-vous:

> * En tant que **membre de l'équipe**, je peux créer de nouvelles entrées dans le backlog du projet, 
>   si bien que les besoins fonctionnels de notre projet pourront être récolter.
>   Une `story` sera définie par un titre, une description, une évaluation en points de sa complexité, 
>   ainsi que sa valeur cliente `business value`.

Transcrivons cela dans notre tests fonctionnels:

`specs/story_specs.js`

```js
var vows = require('vows'),
    assert = require('assert');

var story = require('../lib/story');

var UUID_PATTERN = /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{8}/;

vows.describe('Story').addBatch({
    'A new story': {
        topic: function () {
            return story.create({
                name:"As a developer, I want to known NodeJS so that i increase my knowledge", 
                description: "By learning NodeJS, the developer will be able to undestand its success", 
                complexity: 7,
                business_value: 120
            });
        },

        'should return an instance of Story' : function(st) {
            assert.instanceOf (st, story.Story);
        },

        'should have the specified name': function (story) {
            assert.equal (story.name(), 'As a developer, I want to known NodeJS so that i increase my knowledge');
        },

        'should have the specified description': function (story) {
            assert.equal (story.description(), 'By learning NodeJS, the developer will be able to undestand its success');  
        },

        'should have the specified complexity': function (story) {
            assert.equal (story.complexity(), 7);  
        },

        'should have the specified business value': function (story) {
            assert.equal (story.business_value(), 120);  
        },

        'should have a generated uuid': function (story) {
            assert.equal(UUID_PATTERN.test(story.uuid()), true);
        }
    }
}).export(module); // Export the Suite
```

Créons aussi notre premier test unitaire:
`test/story_test.js`

```js
var story  = require("../lib/story");

exports["create return a new story"] = function (test) {
    var st = story.create("mccallum");
    test.ok(st instanceof story.Story);
    test.done();
};
```

Un petit tour sur notre console, c'est bien rouge! Definissons notre classe `Story`:

`lib/story.js`

```js
    /**
     *  Story
     */
    function Story() {}
    exports.Story = Story;

    exports.create = function(data) {
        var story = new Story();
        return story;
    };
```

Notre test unitaire devient vert, ainsi que le premier test fonctionnel.

Passons rapidement, et ajoutons alors les tests unitaires suivants:
`test/story-test.js`

```js
    var story  = require("../lib/story");
    var UUID_PATTERN = /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{8}/;

    exports["create return a new story"] = function (test) {
        var st = story.create("mccallum");
        test.ok(st instanceof story.Story);
        test.done();
    };

    exports["create return a new story with the given name"] = function (test) {
        var st = story.create({name:"mccallum"});
        test.equal(st.name(), "mccallum");
        test.done();
    };

    exports["create return a new story a generated uuid"] = function (test) {
        var st = story.create({name:"mccallum"});
        test.ok(UUID_PATTERN.test(st.uuid()));
        test.done();
    };

    exports["a new story must have an `events` method to retrieve its history"] = function (test) {
        var st = story.create({name:"mccallum"});

        var events = st.events();
        test.ok(events instanceof Array);
        test.done();
    };

    exports["a new story must have a single `event` in its history"] = function (test) {
        var st = story.create({name:"mccallum"});

        var events = st.events();
        test.ok(events instanceof Array);
        test.equal(events.length, 1);
        test.done();
    };

    exports["a new story must have a single `event` in its history of type 'story_created'"] = function (test) {
        var st = story.create({name:"mccallum"});

        var events = st.events();
        test.ok(events instanceof Array);
        test.equal(events.length, 1);
        test.equal(events[0].event_type(), "story_created");
        test.done();
    };
```

Inspirons nous fortement de notre classe `Projet`:
* notre classe `Story` va hériter de `AggregateRoot`
* nous ajoutons un évènement `StoryCreated` définit comme suit:

```js

var StoryCreated = function(project_id, story_id, story_name, story_description, complexity, business_value) {
    this.event_type = to_f("story_created");
    this.project_id = to_f(project_id);
    this.story_id   = to_f(story_id);
    this.story_name = to_f(story_name);
    this.story_description = to_f(story_description);
    this.complexity = to_f(complexity);
    this.business_value = to_f(business_value);
};

exports.StoryCreated = StoryCreated;
```

* rajoutons le `event_handler` correspondant à l'évènement `story_created`
* et nous obtenons alors:

`lib/story.js`

```js
    var uuid  = require('node-uuid'),
        aroot = require('./aggregate_root'),
        nutil = require('util'),
        misc  = require('./utilities');
    
    var to_f = function(value) { 
        return function () { 
            return value; 
        };
    };
    
    /**
     *  Events
     */
    
    var StoryCreated = function(project_id, story_id, story_name, story_description, complexity, business_value) {
        this.event_type = to_f("story_created");
        this.project_id = to_f(project_id);
        this.story_id   = to_f(story_id);
        this.story_name = to_f(story_name);
        this.story_description = to_f(story_description);
        this.complexity = to_f(complexity);
        this.business_value = to_f(business_value);
    };
    
    exports.StoryCreated = StoryCreated;
    
    /**
     *  Story
     */
    var methods = {
        event_handlers : {
            on_story_created: function(event) {
                this._uuid = event.story_id();
                this._name = event.story_name();
                this._desc = event.story_description();
                this._complexity = event.complexity();
                this._business_value = event.business_value();
            }
        },
        name : function () {
            return this._name;
        },
        description : function () {
            return this._desc;
        },
        complexity : function () {
            return this._complexity;
        },
        business_value : function () {
            return this._business_value;
        }
    };
    
    function Story() {}
    nutil.inherits(Story, aroot.AggregateRoot);
    misc.mixin(Story.prototype, methods);
    exports.Story = Story;
    
    exports.create = function(data) {
        var story = new Story();
        story.apply_event(new StoryCreated(
            data.project_id, 
            uuid(), 
            data.name, 
            data.description, 
            data.complexity, 
            data.business_value));
        return story;
    };
```

La bonne nouvelle c'est que tous nos tests passent. La mauvaise nouvelle c'est que le caractère obligatoire
du nom de la `Story` et de l'identifiant du projet ne sont pas du tout vérifiés.
Enrichissons nos tests afin de combler ce manque:

`test/story_test.js`

```js
    exports["a new story must have a 'name' and a 'project_id' specified"] = function (test) {
        test.throws(function () {
            story.create({});
        });
        test.done();
    }
    
    exports["a new story must have a 'project_id' specified"] = function (test) {
        test.throws(function () {
            story.create({name:"mccallum"});
        });
        test.done();
    }
    
    exports["a new story must have a 'name' specified"] = function (test) {
        test.throws(function () {
            story.create({project_id:"mccallum"});
        });
        test.done();
    }
```

Modifions alors notre `Story` afin d'ajouter les vérifications voulues:

```js
    exports.create = function(data) {
        if(typeof data.project_id === 'undefined') {
            throw new Error("Missing story's <project_id>!");
        }
        if(typeof data.name === 'undefined') {
            throw new Error("Missing story's <name>!");
        }

        var story = new Story();
        story.apply_event(new StoryCreated(data.project_id, 
            uuid(), data.name, data.description, data.complexity, data.business_value));
        return story;
    };
```

et la, hourra nos tests passent... enfin les nouveaux... parce que les anciens sont pratiquement
tous rouges: il manque le `project_id` dans la plupart. Une fois ajouté dans tous ces tests,
ils passent tous, eh eh!











