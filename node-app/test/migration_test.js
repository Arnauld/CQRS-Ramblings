var migration  = require("../lib/migration"),
	utilities  = require("../lib/utilities");


exports["vendor_migrations must iterate over the ordered migrations of a vendor"] = function (test) {
	var migrations = [];
    migration.vendor_migrations("postgres", function(migration_id, statements) {
        migrations[migrations.length] = [migration_id, statements];
    });
	test.ok(migrations.length >0 );
	test.ok(utilities.starts_with(migrations[0][0],"0000"));
	test.ok(utilities.starts_with(migrations[1][0],"0001"));
	test.ok(utilities.starts_with(migrations[2][0],"0002"));
    test.done();
};


exports["vendor_migrations must provides migration trimmed statements one by one"] = function (test) {
	var migrations = [];
    migration.vendor_migrations("postgres", function(migration_id, statements) {
        migrations[migrations.length] = [migration_id, statements];
    });
	test.ok(migrations.length >0 );

	var stmts0 = migrations[0][1];
	test.ok(stmts0.length === 1 );
	test.ok(!utilities.contains(stmts0[0], ";"));
	test.equal(stmts0[0], [
			'CREATE TABLE migrations',
			'(',
			'  migration_id       CHARACTER VARYING(255) NOT NULL,',
			'  migration_sequence INTEGER NOT NULL,',
			'  migration_date     TIMESTAMP NOT NULL,',
			'  CONSTRAINT migrations_pkey PRIMARY KEY (migration_id,migration_sequence)',
			')'
		].join('\n'));

	var stmts1 = migrations[1][1];
	test.ok(stmts1.length === 1 );

	var stmts2 = migrations[2][1];
	test.ok(stmts2.length === 2 );
	test.equal(stmts2[1], 'CREATE INDEX aggregateevts_aggid ON aggregate_events (aggregate_id)');
    test.done();
};


exports["vendor_script_list must iterate over the ordered scripts of a vendor"] = function (test) {
	var filenames = [];
	migration.vendor_scripts("postgres", function (filename) {
		filenames[filenames.length] = filename;
	});
	test.ok(filenames.length >0 );
	test.ok(utilities.starts_with(filenames[0],"0000")); 
	test.ok(utilities.starts_with(filenames[1],"0001")); 
	test.ok(utilities.starts_with(filenames[2],"0002")); 
    test.done();
};

exports["script_to_statements must split scripts into statements"] = function (test) {
	var script = [
		'create table my_table {',
		'  name String,',
		'  desc String,',
		'  create constraint pk,',
		'};',
		'',
		'alter table rename_to the_table;'
	].join('\n');

	var stmts = [];
	migration.script_to_statements(script, function(stmt) {
		stmts[stmts.length] = stmt;
	});
	test.ok(stmts.length === 2);
	test.equal(stmts[0],[
		'create table my_table {',
		'  name String,',
		'  desc String,',
		'  create constraint pk,',
		'}'].join('\n')); 
	test.equal(stmts[1],'alter table rename_to the_table');
    test.done();
};


exports["script_to_statements must split single script into statement"] = function (test) {
	var script = [
		'create table my_table {',
		'  name String,',
		'  desc String,',
		'  create constraint pk,',
		'};'
	].join('\n');

	var stmts = [];
	migration.script_to_statements(script, function(stmt) {
		stmts[stmts.length] = stmt;
	});
	test.ok(stmts.length === 1);
	test.equal(stmts[0],[
		'create table my_table {',
		'  name String,',
		'  desc String,',
		'  create constraint pk,',
		'}'].join('\n')); 
    test.done();
};