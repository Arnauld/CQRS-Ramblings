var domain = require("../lib/domain");

var UUID_PATTERN = /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{8}/

exports["create_project"] = function (test) {
	var project = domain.create_project("mccallum");
	test.equal(project.name(), "mccallum");
	test.equal(UUID_PATTERN.test(project.uuid()), true);
    test.done();
};