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
