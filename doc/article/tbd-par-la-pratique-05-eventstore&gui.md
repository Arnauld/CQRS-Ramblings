### Persistence

Interessons-nous à persister nos données afin de pouvoir les conserver d'une session à l'autre.
Afin de démarrer simplement nous utiliserons une base de données `postgres` comme unité de stockage.
Nous avons vu que seuls nos évènements devaient être persistés, ce n'est pas tout à fait vrai. 
Nous allons persister les entités et leurs évènements.

Il existe de nombreux articles sur la création d'un `EventStore`, dans notre cas nous prendrons comme base
une modélisation décrite par Greg Young dans [cet article][eventstore1].

[eventstore1]:http://cqrsinfo.com/documents/building-event-storage/

Rappellons brièvement cette modélisation d'un point de vue base de données.

*Note* bien que ce soit des notions bien différentes, nous utiliserons dans cet article le mot **aggregat**
à la place de **entité** dans nos descriptions, ceci afin d'être plus en adéquation avec la littérature
autour de `cqrs`. Pour rappel, chacune de nos entité étend de `AggregateRoot`, l'amalgame n'est donc pas si farfelu.
Un aggregat est un concept plus large que le concept d'entités, et définit un contexte d'intégrité de son contenu.
Une entité est généralement un aggrégat, l'inverse n'est pas toujours vrai (même si aucun exemple ne me vienne
en tête à cet instant)

Nous crééons deux tables, la première `Aggregates` sera responsable de maintenir les informations de chaque aggregat:

* son identifiant: `aggregate_id`
* le type de l'aggrégat: `type`, c'est à dire le type généralement le type de l'entité sous-jacente 
  par exemple: `story`, `project`, `sprint` ...
* sa `version`. La version d'un aggregat sera principalement utilisée pour implémenter le mécanisme de
  mise à jour optimiste (`optimisting locking`). Un point interessant et très simple consiste à utiliser,
  comme numéro de version, le nombre d'élément contenu dans l'historique. En effet, l'historique d'un
  aggrégat ne peux que croitre, puisque les évènements sont toujours ajoutés et ne peuvent jamais être
  supprimés. Tous les changements d'états sont appliqués séquentiellement, il est donc même possible
  d'utiliser l'index d'un évènement comme identifiant de celui-ci. En conservant, la version sur l'aggrégat
  on peux ainsi génèrer l'identifiant des prochains évènements sans relire l'intégralité de l'historique.
  De plus, l'identifiant de l'évènement peut être utilisé pour ordonner et réappliquer l'historique
  dans le bon ordre.
  Aussi, une entité peut être mise à jour avec de nouveaux évènements si et seulement si les évènements 
  s'applique depuis la dernière version persistée de l'entité. [TODO] un example concret.

<table>
    <th>
        <td>Nom de colonne</td><td>Type de données</td>
    </th>
    <tr>
        <td>aggregate_id</td><td>varchar(36)</td>
        <td>aggregate_type</td><td>varchar(255)</td>
        <td>aggregate_version</td><td>integer</td>
    </tr>
</table>

```sql
CREATE TABLE aggregates
(
  aggregate_id      CHARACTER VARYING(36) NOT NULL,
  aggregate_type    CHARACTER VARYING(255) NOT NULL,
  aggregate_version INTEGER NOT NULL,
  CONSTRAINT aggregates_pkey PRIMARY KEY (aggregate_id)
);
```

La seconde table `AggregateEvents` sera responsable de conserver les évènements eux-mêmes:

* l'identifiant de l'aggrégat auquel est rattaché l'évènement. Cette colonne est indéxée sur la table précedente.
* l'identifiant de l'évènement: correspondant à sa position dans l'historique
* le type d'évènement afin de simplifier les éventuelles requêtes et analyses futures
* les données de l'évènements sous forme de données brutes. Nous utiliserons dans notre cas la sérialization json
  de notre évènement.

<table>
    <th>
        <td>Nom de colonne</td><td>Type de données</td>
    </th>
    <tr>
        <td>aggregate_id</td><td>varchar(36)</td>
        <td>event_id</td><td>integer</td>
        <td>event_type</td><td>varchar(255)</td>
        <td>event_data</td><td>clob / text</td>
    </tr>
</table>

```sql
CREATE TABLE aggregate_events
(
  aggregate_id   CHARACTER VARYING(36) NOT NULL,
  event_id       INTEGER NOT NULL,
  event_type     CHARACTER VARYING(255) NOT NULL,
  event_data     TEXT, 
  CONSTRAINT aggregateevts_pkey PRIMARY KEY (aggregate_id, event_id),
  CONSTRAINT aggregateevts_fk1  FOREIGN KEY (aggregate_id) REFERENCES aggregates(aggregate_id)
);

CREATE INDEX aggregateevts_aggid ON aggregate_events (aggregate_id);
```

Postgres est une base de données simple mais très complète. Nous ne détaillerons pas son fonctionnement, 
nous vous recommandons donc de vous familliariser un peu avec et de créer une base de données par 
l'intermédiaire de pgAdmin (voir [ici](http://postgresql.developpez.com/cours/) pour des tutoriaux 
très simples sur l'installation, la mise en oeuvre et l'utilisation de pgAdmin).

Nous considérerons désormais qu'un role de connexion dédié a été créé et est disponible pour nous
permettre de créer les bases de données dont nous aurons besoin notament pour nos tests d'intégrations
et de validation de script SQL. Dans notre cas nous l'avons appellé `integration` et son mot de passe
est `1tegration`.

Ce que nous allons mettre en place dès maintenant:

#### NodeJS et Postgres, où sont nos tests d'intégrations?

Afin de distinguer les tests unitaires qui doivent rester rapides et indépendants, nous allons créer un
répertoire dédié à nos tests d'intégrations `it`.

Dans `conf/sql/postgres` nous placerons les fichiers `sql` qui serviront aux différentes migrations
de notre application. Nos scripts seront nommés de tels sortes que l'on puisse automatiquement déterminer
leur ordre d'application.

`conf/sql/postgres/0001-aggregates&events.sql`

```sql
CREATE TABLE aggregates
(
  aggregate_id      CHARACTER VARYING(36) NOT NULL,
  aggregate_type    CHARACTER VARYING(255) NOT NULL,
  aggregate_version INTEGER NOT NULL,
  CONSTRAINT aggregates_pkey PRIMARY KEY (aggregate_id)
);

CREATE TABLE aggregate_events
(
  aggregate_id   CHARACTER VARYING(36) NOT NULL,
  event_id       INTEGER NOT NULL,
  event_type     CHARACTER VARYING(255) NOT NULL,
  event_data     TEXT, 
  CONSTRAINT aggregateevts_pkey PRIMARY KEY (aggregate_id, event_id),
  CONSTRAINT aggregateevts_fk1  FOREIGN KEY (aggregate_id) REFERENCES aggregates(aggregate_id)
);

CREATE INDEX aggregateevts_aggid ON aggregate_events (aggregate_id);
```

Créons aussi un fichier d'environement dans lequel on renseignera l'emplacement des binaires de `postgres`
ainsi que les identifiants d'un role de connexions ayant les droits de créer une base de données
(dans la fenêtre **propriétés** du rôle de connexion, onglet **Droits du rôle**, cochez la cache
"Peux crééer des bases de données).

`conf/env-it.json`

```json
{
    "postgres_bin"  : "/Library/PostgreSQL/9.0/bin/",
    "postgres_user" : "integration",
    "postgres_pass" :  "1tegration"
}
```

**Note importante** sur `JSON.parse`; La transformation d'une chaîne de caractère au format JSON en son
équivalent javascript a été douleureuse, en effet la méthode `JSON.parse` est très stricte, et nécessite
une syntaxe irréprochable. Voici les déboires, sous forme de tests, que nous avons subit:

`test/json_test.js`

```js
    exports["JSON issue: key must be quoted"] = function (test) {
        test.throws(function () {
            JSON.parse('{ name : "mccallum" }');
        });
        test.done();
    };
    
    exports["JSON issue: key cannot be quoted by single quote"] = function (test) {
        test.throws(function () {
            JSON.parse("{ 'name' : \"mccallum\" }");
        });
        test.done();
    };
    
    exports["JSON issue: value cannot be quoted by single quote"] = function (test) {
        test.throws(function () {
            JSON.parse("{ \"name\" : 'mccallum' }");
        });
        test.done();
    };
```

Ce qui est interessant aussi à noter c'est que dans notre approche, les tests servent aussi
de terrain d'expérimentation. Et si ceux-ci sont suffisament autonomes, nous pouvons les 
conserver à titre d'exemple et de non regression sur les outils que nous utilisons à travers
notre application.

Via `pgAdmin / Fichier / Ouvrir .pgpass` ajoutons les paramètres de connection de notre utilisateur
afin que le mot de passe ne soit pas demandé en ligne de commande, notons l'emplacement de ce fichier
et éditons le comme suit:

    localhost:5432:*:postgres:postgres
    localhost:5432:*:integration:1tegration

Nous utiliserons principalement deux bases de données: `dropable_dbname` et `persistent_dbname`.
La première base de données `dropable_dbname` sera supprimée et recrée à chaque fois que les 
scripts de migration seront testés, afin de valider leurs syntaxes sur une base vierge. La seconde
base de données `peristent_dbname` quant à elle sera conservée, et considérée comme présente par
nos tests.

La première version de notre script de tests de migration, après quelque refactorings, ressemble à:

`it/postres_migration_it.js`

```js
    var nutil = require('util'),
        exec  = require('child_process').exec,
        fs    = require('fs'),
        pg    = require('pg'),
        utilities = require('../lib/utilities'),
        migration = require('../lib/migration');

    var settings_json = fs.readFileSync(__dirname + '/../conf/env-it.json', 'utf8');
    var settings = JSON.parse(settings_json);
    var db_name = settings.dropable_dbname;

    var command_drop_db = 
        settings.postgres_bin + "dropdb " + db_name
            + " -e" //echo the commands
            + " -U " + settings.postgres_user;

    var command_create_db = 
        settings.postgres_bin + "createdb " + db_name
            + " -e" //echo the commands
            + " -E UTF8"
            + " -O " + settings.postgres_user
            + " -U " + settings.postgres_user;

    var executeScripts = function () {
        var client = new pg.Client('postgres://'+settings.postgres_user+':'+settings.postgres_pass+'@localhost:5432/' + db_name);
            client.connect();
        var last_query;
        var executor = function(sql) {
            console.log(sql);
            last_query = client.query(sql);
        };

        migration.vendor_statements("postgres", executor);

        //fired after last row is emitted
        last_query.on('end', function() { 
          client.end();
        });
    };

    var create_db = function() {
        exec(command_create_db,
          function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
              console.log('exec error: ' + error);
            }
            console.log('executing scripts');
            executeScripts();
        });
    };

    // pkill -f 'postgres: postgres <database>'

    exec(command_drop_db,
          function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            if(stderr.indexOf("does not exist") === -1) {
                console.log('stderr: ' + stderr);
                if (error !== null) {
                  console.log('exec error: ' + error);
                }
            }
            create_db();
        });
```

