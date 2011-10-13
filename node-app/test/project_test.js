var prj  = require("../lib/project");
var uuid = require('node-uuid');

var UUID_PATTERN = /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{8}/;

exports["create return the specified name"] = function (test) {
	var project = prj.create("mccallum");
	test.equal(project.name(), "mccallum");
    test.done();
};

exports["create generate a valid uuid"] = function (test) {
	var project = prj.create("mccallum");
	test.equal(UUID_PATTERN.test(project.uuid()), true);
    test.done();
};

exports["a new project must have an `events` method to retrieve its history"] = function (test) {
    var project = prj.create("mccallum");

    var events = project.events();
    test.ok(events instanceof Array);
    test.done();
};

exports["a new project must have a single `event` in its history"] = function (test) {
	var project = prj.create("mccallum");

	var events = project.events();
	test.ok(events instanceof Array);
	test.equal(events.length, 1);
	test.done();
};

exports["a new project must have a single `event` in its history of type 'project_created'"] = function (test) {
	var project = prj.create("mccallum");

	var events = project.events();
	test.ok(events instanceof Array);
	test.equal(events.length, 1);
	test.equal(events[0].event_type(), "project_created");
	test.done();
};

exports["renaming a project must change its name according to new one"] = function (test) {
	var project = prj.create("mccallum");
	project.rename("travis");
	test.equal(project.name(), "travis");
	test.done();
};

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






