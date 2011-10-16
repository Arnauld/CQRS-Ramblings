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

Compte-tenu de tout ce que nous avons pu voir jusqu'ici, nous passons rapidement sur
l'ajout des méthodes `rename`, `changeDescription`, `changeComplexity` et `changeBusinessValue`.
Pour chacune de ces méthodes, nous definissons les évènements respectifs suivant: `StoryRenamed`,
`StoryDescriptionChanged`, `StoryComplexityChanged` et `StoryBusinessValueChanged`.
De la même manière que pour la classe `Projet`, nous ajoutons la méthode `load_from_history`.

Faisons une petite pause et revenons quelques instants sur notre modélisation.
Voici les étapes (d'un point de vue technique) pour la création d'un `Project` et l'ajout de `Story`
à celui-ci:

```js
    var my_app = project.create("MyApplication");
    ...
    var story01 = story.create({ 
        project_id: my_app.uuid(), 
        name: "As a team member, i want to navigate through all the stories of my project."
    });
```

[TODO] méthode story.create est dissociée du projet, et a été ramenée au minimum d'informations requises
c'est à dire le `project.uuid` ... un `project` peux compter plusieurs milliers de `story` dans son `backlog`
c'est pourquoi contrairement à une approche *classique* nous ne souhaitons pas faire porter directement
par le projet l'intégralité des `story` qui y sont rattaché, en d'autre terme nous évitons d'introduire
une relation navigable et bidirectionnelle entre ces deux entités.

#### Et les commentaires?

> * En tant que **membre de l'équipe**, je peux completer une entrée du backlog en modifiant ses informations
> ou en ajoutant un commentaire, si bien que cette entrée disposera de plus amples informations à mesure des
> reflexions qu'elle peux suciter.

Définissions dans un premier temps notre test fonctionnel correspondant à la création d'un commentaire.

La difficulté qui apparait désormais est de vérifier que notre commentaire a bien été ajouté. En effet, si l'on prévoit
que le nombre de commentaire peut être conséquent, il est peu probable que nous les conservions tous en mémoire. Ceci nous
amène au point suivant: la persistence de nos données. Le soucis que nous voyons avec nos commentaires est en fait déjà
présents à travers l'historique de nos entités, devons-nous conserver l'intégralité des évènements en mémoire? La réponse
est bien évidemment non! Nous ne devrions conserver en mémoire sur nos entités uniquement les données qui ont une importance 
métier pour assurer son intégrité à tout instant. Dans ce cas, pourquoi conserver sur une `Story`, 
sa `description`, sa `business value` et sa `complexity` ? Et bien tout simplement parce dans un premier temps, nous
ne disposons pas d'autre moyen de vérifier ces valeurs, et que d'autre par il ne devrait pas s'agir d'une consommation
mémoire trop importante, en effet il est peu probable que le nom d'un `Story` excède les centaines de caractères, et que sa
description (même en html) ne soient beaucoup plus importante qu'une page de texte. Il est donc raisonable dans un
premier de temps de conserver ces valeurs directement sur l'entité.

D'autre part, l'intégralité de l'historique de nos entités est lui aussi conservé en mémoire, il va donc falloir 
remédier à cela aussi. Mais chaque chose en son temps.
Plutôt que de conserver les commentaires en mémoires, nous travaillerons sur l'historique directement, et vérifierons
que le commentaire est bien présent parmis les évènements de notre entité. Ainsi, lorsque la persistence de l'historique
sera résolu, nos commentaires le seront aussi.

`specs/story_specs.js`

```js
    'Story' : {
        topic: function () {
            return story.create({
                project_id: "cafebabe-3550",
                name: "As a developer, I want to known NodeJS so that i increase my knowledge", 
            });
        },
        'can be improved by adding comment on it' : function(story) {
            var CONTENT = "NodeJS looks promising, not only for application but also as a tool to test and learn javascipt";
            story.add_comment(CONTENT);
            var last_event = story.last_event();
            assert.equal (last_event.event_type(), "story_comment_added");
            assert.equal (last_event.content(), CONTENT);
        }
    }
```

On pourra noter l'ajout de la méthode `last_event` sur notre classe `AggregateRoot`:

`lib/aggregate_root.js`

```js
    // public methods
    AggregateRoot.prototype = {
        ...
        events: function () { return this._events; },
        last_event: function () {
            if(typeof this._events === 'undefined') {
                return; // returns 'undefined'
            }
            else if(this._events.length === 0) {
                return; // returns 'undefined'
            }
            return this._events[this._events.length-1];
        },
        apply_event : function (event) {
        ...
```

Quelques tests unitaires au préalable, et notre `Story` est modifiée comme suit:

`lib/story.js`

```js
    var StoryCommentAdded = function(story_id, new_comment) {
        this.event_type = to_f("story_comment_added");
        this.content    = to_f(new_comment);
    };
    exports.StoryCommentAdded = StoryCommentAdded;
    
    /**
     *  Story
     */
    var methods = {
        event_handlers : {
            ...
            on_story_comment_added: function (event) {}
        },   
        
        ...
        
        add_comment: function(new_comment) {
            this.apply_event(new StoryCommentAdded(this._uuid, new_comment));
        }
    };

    ...
```

