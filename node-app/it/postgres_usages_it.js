var nutil = require('util'),
    exec  = require('child_process').exec,
    fs    = require('fs'),
    pg    = require('pg'),
    utilities = require('../lib/utilities'),
    migration = require('../lib/migration');

var settings_json = fs.readFileSync(__dirname + '/../conf/env-it.json', 'utf8');
var db_name = settings.persistent_dbname;


var client = new pg.Client('postgres://'+settings.postgres_user+':'+settings.postgres_pass+'@localhost:5432/'+db_name);
    client.connect();

exports["Aggregate can be inserted in database"] = function(test) {
	client.query('begin');
	client.query("INSERT INTO person(name, age) VALUES($1, $2)", ['Zed', 270], assert.calls(function(err, result) {
      assert.isNull(err);
    }));

};