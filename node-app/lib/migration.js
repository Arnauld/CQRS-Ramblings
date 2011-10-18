var nutil = require('util'),
    fs    = require('fs'),
    utilities = require('../lib/utilities');

var vendor_scripts_dir = function(dbvendor) {
    return __dirname + '/../conf/sql/' + dbvendor;
};

var vendor_scripts = function(dbvendor, callback) {
    var script_dir = vendor_scripts_dir(dbvendor);
    var file_names = fs.readdirSync(script_dir);
    file_names.sort();
    file_names.forEach(callback);
};

exports.vendor_scripts = vendor_scripts;

var script_to_statements = function (script, callback) {
    var regex = new RegExp("[;]+", "g");
    var sqls  = script.split(regex);
    sqls.forEach(function(sql) {
       var trimmed =utilities.trim(sql);
       if(trimmed.length>0) {
           callback(trimmed);
       }
    });
};

exports.script_to_statements = script_to_statements;

var vendor_migrations = function (dbvendor, callback) {
    vendor_scripts(dbvendor, function(file_name) {
        var script_dir   = vendor_scripts_dir(dbvendor);
        var migration_id = file_name.substr(0,4);
        var content = fs.readFileSync(script_dir + '/' + file_name, 'utf8');
        var statements = [];
        script_to_statements(content, function(statement) { 
            statements[statements.length] = statement;
        });
        callback(migration_id, statements);
    });
};

exports.vendor_migrations = vendor_migrations;
