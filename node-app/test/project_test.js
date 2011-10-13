var domain = require("../lib/domain");

var UUID_PATTERN = /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{8}/;

exports["create_project return the specified name"] = function (test) {
	var project = domain.create_project("mccallum");
	test.equal(project.name(), "mccallum");
    test.done();
};

exports["create_project generate a valid uuid"] = function (test) {
	var project = domain.create_project("mccallum");
	test.equal(UUID_PATTERN.test(project.uuid()), true);
    test.done();
};

exports["create_project must generate an event of type 'project_created' in history"] = function (test) {
    var project = domain.create_project("mccallum");

    var events = project.events();
    test.ok(events instanceof Array);
    test.equal(events.length, 1);
    test.equal(events[0].event_type(), "project_created");
    test.done();
};