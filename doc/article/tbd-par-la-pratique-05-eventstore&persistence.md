### Persistence

Interessons-nous à persister nos données afin de pouvoir les conserver d'une session à l'autre.
Afin de démarrer simplement nous utiliserons une base de données `postgres` comme unité de stockage.

Nous avons vu que seuls nos évènements devaient être persistés, ce n'est pas tout à fait vrai. 
Nous allons persister les entités et leurs évènements. Il n'est pas nécessaire de créer une table par
type d'entité, mais uniquement les tables nécessaires à stocker les évènements.

Il existe de nombreux articles sur la création d'un `EventStore`, nous prendrons comme base
une modélisation décrite par Greg Young dans [cet article][eventstore1].

[eventstore1]:http://cqrsinfo.com/documents/building-event-storage/

Rappellons brièvement cette modélisation d'un point de vue base de données.

*Note* bien que ce soit des notions bien différentes, nous utiliserons dans cet article le mot **aggregat**
à la place de **entité** dans nos descriptions, ceci afin d'être plus en adéquation avec la littérature
autour de `cqrs`. Pour rappel, chacune de nos entité étend de `AggregateRoot`, l'amalgame n'est donc pas si farfelu.
Un aggregat est un concept plus large que le concept d'entités, et définit un contexte d'intégrité de son contenu.
Une entité est généralement un aggrégat, l'inverse n'est pas toujours vrai (même si aucun exemple ne me vient
en tête à cet instant)

Nous créérons deux tables, la première `Aggregates` sera responsable de maintenir les informations de chaque aggregat:

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
    <tr>
        <th>Nom de colonne</th><th>Type de données</th>
    </tr>
    <tr>
        <td>aggregate_id</td><td>varchar(36)</td>
    </tr>
    <tr>
        <td>aggregate_type</td><td>varchar(255)</td>
    </tr>
    <tr>
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
    <tr>
        <th>Nom de colonne</th><th>Type de données</th>
    </tr>
    <tr>
        <td>aggregate_id</td><td>varchar(36)</td>
    </tr>
    <tr>
        <td>event_id</td><td>integer</td>
    </tr>
    <tr>
        <td>event_type</td><td>varchar(255)</td>
    </tr>
    <tr>
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

`conf/sql/postgres/0001-aggregates.sql`

```sql
CREATE TABLE aggregates
(
  aggregate_id      CHARACTER VARYING(36) NOT NULL,
  aggregate_type    CHARACTER VARYING(255) NOT NULL,
  aggregate_version INTEGER NOT NULL,
  CONSTRAINT aggregates_pkey PRIMARY KEY (aggregate_id)
);
```

`conf/sql/postgres/0002-aggregates_events.sql`

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

#### <strike>Quart d'heure</strike> Soirées <strike>détente</strike> explorations de l'utilisation de Postgres en mode non bloquant

Afin de bien comprendre le fonctionement du module [node-postgres][node-postgres], nous allons nous écarter
quelque peu de notre application pour effectuer un [**spike**][spike-aubry] sur l'utilisation de ce module.

En effet, généralement les requêtes sql sont effectuées de manière séquentiellement et bloquantes, c'est
à dire que l'on attend (le fil d'execution est en attente) que notre base de données ait renvoyé le résultat
avant d'enchainer avec la prochaine requête.

```scala
  var result = execute("""create table creatures ( 
      name CHARACTER VARYING(255) NOT NULL,
      description TEXT
  )
  """); // appel bloquant on attend la réponse avant de poursuivre

  var insert_sql = "insert into creatures (name, desc) values (?,?)";
  execute(insert_sql, ["Korrigan", "Créature légendaire du folklore de Bretagne, comparable au lutin français"]);
  execute(insert_sql, ["Mary Morgan", "Fées d'eau bretonnes semblables à des femmes, qui partagent la symbolique des sirènes"]);
```

[node-postgres]:https://github.com/brianc/node-postgres
[spike-aubry]:http://www.aubryconseil.com/post/2008/03/15/387-des-spikes-dans-les-sprints

Il est en effet nécessaire d'attendre que la table `creatures` soit créée avant de pouvoir insérer des enregistrements.
Le problème de cette approche est de monopoliser une partie des ressources de l'application en attendant la réponse de
notre base de données, le traitement est bloqué.

[node-postgres][node-postgres] propose une approche différente et un peu déroutante en prime abord. Lorsque la requête
sql est soumise à la base de données, il est possible d'y associer une fonction de rappel (`callback`) qui sera invoquée 
lorsque le résultat de notre requête sera disponible. 
Pendant ce temps, l'application continue son execution et n'est pas bloquée à cette instruction.

Reprenons l'exemple précédent, celui-ci pourrait ainsi être transformée comme suit:

```js
 1    var client = new pg.Client('postgres://'+settings.postgres_user+':'+settings.postgres_pass+'@localhost:5432/' + db_name);
 2        client.connect();
 3    
 4    var insert_sql = "insert into creatures (name, desc) values (?,?)";
 5    var create_query = client.query("create table creatures ( ... )");
 6    
 7    create_query.on('end', function() {
 8        var insert1 = client.query(insert_sql, ["Korrigan", "Créature ..."]);
 9        insert1.on('end', function() {
10            var insert2 = client.query(insert_sql, ["Mary Morgan", "Fées ..."]);
11            insert2.on('end', function() {
12                client.end();
13            });
14          })
15    });
16    ...
```

Ligne `5`, la requête de création de la table est soumise au serveur, le serveur n'a pas encore répondu que notre
application continue de s'executer. Nous enregistrons alors une fonction de rappel ligne `7` qui sera
invoquée lorsque notre création de table sera terminée (nous ne détaillons pas ici les gestions d'erreurs).
Notre application poursuit alors son execution ligne `16`.

Lorsque la table est créée, notre fonction de retour est invoquée, et nous poursuivons l'execution de notre code
ligne `8`. Nous insérons alors notre première valeur, et pendant ce temps, enregistrons une nouvelle fonction de
retour (ligne `9`) qui sera appellée et nous permettra d'enregistrer notre seconde valeur. Une fois la première
valeur insérée, notre fonction sera invoquée, et notre seconde valeur insérée.

Si l'on regarde de plus près, on peux se rendre compte que seules nos insertions nécessitent d'être effectuées
après la création de la table. Dans notre exemple, il n'est pas nécessaire que la seconde insertion ait lieu
uniquement si la première a bien été réalisée.

Nous pouvons donc modifier le code, afin d'executer nos deux insertion de manière
asynchrone. La difficulté est alors d'être informé lorsque nos deux insertions ont été réalisées.

[node-postgres][node-postgres] nous indique:

> Clients are responsible for creating Queries via the factory method Client#query. 
> The Client can create a new query before the client is connected to the server or while other queries are executing. 
> Internally the Client maintains a queue of Query objects which are popped and executed as the preceding Query completes.
> When the Client's internal query queue is emptied, the Client raises the drain event.

En s'enregistrant sur l'évènement `drain`, il est donc possible d'être informé lorsque toutes nos requêtes
seront executées.

```js
    ...
    // s'assure que même si la `queue` est vide entre temps l'évènement 'drain' 
    // ne sera pas déclenché
    client.pauseDrain();
    client.on('drain', function() {
      client.end();
    });

    var create  = client.query("create table creatures ( ... )");
    var insert1 = client.query(insert_sql, ["Korrigan", "Créature ..."]);
    var insert2 = client.query(insert_sql, ["Mary Morgan", "Fées ..."]);
    insert2.on('end', function() {
        // maintenant que nous avons effectué notre dernière requête sql,
        // si la queue est vide cela signifie bien, que tout est fini
        // rendons possible le déclenchement de l'évènement 'drain' 
        client.resumeDrain();
    });
```

Dans notre cas, les migrations doivent être séquentielles et une migration est conditionnée par la 
réussite de la précédente. La dernière approche n'est donc pas directement envisageable. 
Tentons de rendre la première approche plus dynamique en chaînant les `on('end', function() ...)`
de manière recursive.

Considérons que nos requêtes sql sont dans un tableau `statements`

```js
    var execute_stmts = function(client, index, statements, last) {
      if(index==statements.length) {
        last();
        return;
      }
      var query = client.query(statements[index]);
      query.on('end', function () {
          function(client, index+1, statements, last);
      });
    }
    
    execute_stmts(client, 0, statements, function() {
      client.end();  
    });
```

Si les requêtes sont plus compliquées, au lieu de passer les requêtes SQL, appellons une
fonction qui retournera la dernière `query` qu'elle aura soumise:

```js
    var execute_stmts = function(client, index, statements, last) {
      if(index==statements.length) {
        last();
        return;
      }
      var query = statements[index](client);
      query.on('end', function () {
          function(client, index+1, statements, last);
      });
    }

    execute_stmts(client, 0, statements, function() {
      client.end();  
    });
```

avec par exemple

```js
    statements[1] = function(client) {
        return client.query(insert_sql, ["Korrigan", "Créature ..."])  ;
    };
    statements[2] = function(client) {
        return client.query(insert_sql, ["Mary Morgan", "Fées ..."])  ;
    };
```

Histoire de valider nos connaissances, nous décidons d'écrire un mini-gestionnaire de migration dans le
style (mais en moins ambitieux) que [Liquibase](http://www.liquibase.org/) ou [Flyway](http://code.google.com/p/flyway/).

Celui-ci est responsable d'appliquer les migrations une par une et de conserver la liste des migrations
effectuées avec succès. Cela peux paraître un peu compliqué, mais l'experience
montre qu'une fois mis en place, ce type de système allège considérablement le travail du support,
la remontée des erreurs lors de migration et la reprise sur erreur.

Nous ajoutons donc une table `migrations` qui conservera l'ensemble des migrations qui ont été appliquées.
Chaque migration pouvant être composée de plusieurs requêtes `sql`, nous conserverons aussi l'index de 
la dernière requête `sql` passée avec succès.

`conf/sql/postgres/0000-migration.sql`

```sql
  CREATE TABLE migrations
  (
    migration_id       CHARACTER VARYING(255) NOT NULL,
    migration_sequence INTEGER NOT NULL,
    migration_date     TIMESTAMP NOT NULL,
    CONSTRAINT migrations_pkey PRIMARY KEY (migration_id,migration_sequence)
  );
```

La première version de notre outils de migration, après quelque refactorings, ressemble à:

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

  var update_sequence = function(client, migration_id, index, next) {
      return  function() {
          console.log("Migration [" + migration_id + ", " + index + "]: updating sequence");
          var query = client.query(
              "insert into migrations (migration_id, migration_sequence, migration_date) values($1, $2, $3)", 
              [migration_id, index, new Date()]);
          query.on('error', function(error) {
              console.log("Migration [" + migration_id + ", " + index + "]: updating sequence " + error);
              throw error;
          });
          query.on('end', next);
      };
  };

  var execute_statements = function(client, migration_id, index, statements, last) {
      return function () {
          if(index>=statements.length) {
              last();
              return; 
          }

          var stmt = statements[index];
          console.log("Migration [" + migration_id + ", " + index + "]: <<<" + stmt + ">>>");
          var migration = client.query(stmt);
          migration.on('end', 
              update_sequence(client, migration_id, index, 
                  execute_statements(client, migration_id, index+1, statements, last))
          );
          migration.on('error', function(error) {
              console.log("Migration [" + migration_id + ", " + index + "]: " + error);
              throw error;    
          });
      };
  };

  var execute_migration = function(client, migration_id, statements, on_last_statement) {
      console.log("Migration [" + migration_id + "] #" + statements.length + " statements");

      // retrieve any previously migration sequence applied
      var start_index_query = client.query("select count(*) from migrations where migration_id = $1", [migration_id]);
      start_index_query.on('row', function(row) {
          var index = row.count;
          execute_statements(client, migration_id, index, statements, on_last_statement)();  
      });
      start_index_query.on('error', function(error) {
          var migrations_table_missing = utilities.contains(error.message,'relation "migrations" does not exist');
          var initial_migration = (migration_id === "0000");

          // special case migration '0000'
          if(initial_migration && migrations_table_missing) {
              console.log("Migration [" + migration_id + "] " + error.message);
              client.query('rollback');
              console.log("Starting a new transaction");
              client.query('begin');
              execute_statements(client, migration_id, 0, statements, on_last_statement)();
          }
          else {
              //handle the error
              console.log(error);
              throw error;
          }
      });
  };

  var execute_migrations = function(client, index, migrations, once_last_migration) {

      var migration_id    = migrations[index][0];
      var migration_stmts = migrations[index][1];
      var is_last_migration = (index+1 === migrations.length);

      var begin = client.query('begin');
      begin.on('end', function() {
          var on_last_statement = function() {
              var commit = client.query('commit');
              commit.on('end', function() {
                  console.log("Migration [" + migration_id + "] commited");
                  if(is_last_migration) {
                      once_last_migration();
                  }
                  else {
                      execute_migrations(client, index+1, migrations, once_last_migration);
                  }
              });    
          };

          execute_migration(client, migration_id, migration_stmts, on_last_statement);
      });
  };

  var migrate = function () {
      var client = new pg.Client('postgres://'+settings.postgres_user+':'+settings.postgres_pass+'@localhost:5432/' + db_name);
          client.connect();

      var migrations = [];
      migration.vendor_migrations("postgres", function(migration_id, statements) {
          migrations[migrations.length] = [migration_id, statements];
      });

      execute_migrations(client, 0, migrations, function() {
          client.end();
          console.log("Releasing connection");
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
          console.log('executing migrations');
          migrate();
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

1. la commande `exec(command_drop_db, ...` lance une commande système (`shell`) afin de supprimer notre
   base de données d'intégration
2. en cas de succès, la fonction `create_db()` est alors invoquée, et elle-même lance une commande système
   pour créer notre base de données.
3. en cas de succès, la fonction `migrate()` est invoquée.
4. la fonction `migrate()` est le point de départ des appels récursifs afin de chainer les migrations uniquement
   en cas de succès (comme évoquer précédement). La fonction *recursive* d'execution des migrations est la fonction
   `execute_migrations`.
5. la fonction `execute_migrations` est responsable d'executer une migration donnée `execute_migration`
   En cas de succès, la transaction courante est commitée et l'execution de la prochain migration est
   invoquée de manière récursive.
6. la fonction `execute_migration` est chargée d'executer les requêtes SQL composant le script de migration.
   Il commence tout d'abord par recupérer l'index de la dernière requête SQL executée avec succès et execute
   de manière récursive (`execute_statements`) toutes les requêtes SQL manquantes à partir de cet index.
7. Après chacune de ces requêtes la table `migrations` est mise à jour afin de conserver l'avancement de 
   la migration pour les prochains essais.

En partant d'une base vierge, notre script test donc l'intégralité de nos migrations.
Lançons le 

    node it/postgres_migration_it.js

La console affiche alors:

```
stdout: DROP DATABASE nscrum_dropable_itdb;

stderr: 
stdout: CREATE DATABASE nscrum_dropable_itdb OWNER integration ENCODING 'UTF8';

stderr: 
executing migrations
Migration [0000] #1 statements
Migration [0000] relation "migrations" does not exist
Starting a new transaction
Migration [0000, 0]: <<<CREATE TABLE migrations
(
  migration_id       CHARACTER VARYING(255) NOT NULL,
  migration_sequence INTEGER NOT NULL,
  migration_date     TIMESTAMP NOT NULL,
  CONSTRAINT migrations_pkey PRIMARY KEY (migration_id,migration_sequence)
)>>>
Migration [0000, 0]: updating sequence
Migration [0000] commited
Migration [0001] #1 statements
Migration [0001, 0]: <<<CREATE TABLE aggregates
(
  aggregate_id      CHARACTER VARYING(36) NOT NULL,
  aggregate_type    CHARACTER VARYING(255) NOT NULL,
  aggregate_version INTEGER NOT NULL,
  CONSTRAINT aggregates_pkey PRIMARY KEY (aggregate_id)
)>>>
Migration [0001, 0]: updating sequence
Migration [0001] commited
Migration [0002] #2 statements
Migration [0002, 0]: <<<CREATE TABLE aggregate_events
(
  aggregate_id   CHARACTER VARYING(36) NOT NULL,
  event_id       INTEGER NOT NULL,
  event_type     CHARACTER VARYING(255) NOT NULL,
  event_data     TEXT, 
  CONSTRAINT aggregateevts_pkey PRIMARY KEY (aggregate_id, event_id),
  CONSTRAINT aggregateevts_fk1  FOREIGN KEY (aggregate_id) REFERENCES aggregates(aggregate_id)
)>>>
Migration [0002, 0]: updating sequence
Migration [0002, 1]: <<<CREATE INDEX aggregateevts_aggid ON aggregate_events (aggregate_id)>>>
Migration [0002, 1]: updating sequence
Migration [0002] commited
Releasing connection
```

et le contenu de la table migrations`:

```
    select * from migrations;
```

<table>
    <tr><td>"0000"</td><td>0</td><td>"2011-10-18 12:22:05.774"</td></tr>
    <tr><td>"0001"</td><td>0</td><td>"2011-10-18 12:22:05.788"</td></tr>
    <tr><td>"0002"</td><td>0</td><td>"2011-10-18 12:22:05.803"</td></tr>
    <tr><td>"0002"</td><td>1</td><td>"2011-10-18 12:22:05.806"</td></tr>
</table>

On peux constater que la migration "0002" est bien décomposée en deux sous requêtes: création
de la table et création de l'index.

Nous disposons finalement d'un outil de migration et d'un test d'intégration nous permettant de le valider
à chaque ajout de nouvelles migrations ou d'édition de script.



Revenons à notre projet et à la persistence de nos évènements. Créons pour cela la classe qui modélisera notre
`EventStore`.

### EventStore


