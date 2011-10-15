var story  = require("../lib/story");
var UUID_PATTERN = /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{8}/;

exports["create return a new story"] = function (test) {
	var st = story.create({name:"mccallum", project_id:"cafebabe-3550"});
	test.ok(st instanceof story.Story);
    test.done();
};

exports["create return a new story with the given name"] = function (test) {
	var st = story.create({name:"mccallum", project_id:"cafebabe-3550"});
	test.equal(st.name(), "mccallum");
    test.done();
};

exports["create return a new story a generated uuid"] = function (test) {
	var st = story.create({name:"mccallum", project_id:"cafebabe-3550"});
	test.ok(UUID_PATTERN.test(st.uuid()));
    test.done();
};

exports["a new story must have an `events` method to retrieve its history"] = function (test) {
    var st = story.create({name:"mccallum", project_id:"cafebabe-3550"});

    var events = st.events();
    test.ok(events instanceof Array);
    test.done();
};

exports["a new story must have a single `event` in its history"] = function (test) {
	var st = story.create({name:"mccallum", project_id:"cafebabe-3550"});

	var events = st.events();
	test.ok(events instanceof Array);
	test.equal(events.length, 1);
	test.done();
};

exports["a new story must have a single `event` in its history of type 'story_created'"] = function (test) {
	var st = story.create({name:"mccallum", project_id:"cafebabe-3550"});

	var events = st.events();
	test.ok(events instanceof Array);
	test.equal(events.length, 1);
	test.equal(events[0].event_type(), "story_created");
	test.done();
};

exports["a new story must have a 'name' and a 'project_id' specified"] = function (test) {
	test.throws(function () {
		story.create({});
	});
	test.done();
};

exports["a new story must have a 'project_id' specified"] = function (test) {
	test.throws(function () {
		story.create({name:"mccallum"});
	});
	test.done();
};

exports["a new story must have a 'name' specified"] = function (test) {
	test.throws(function () {
		story.create({project_id:"mccallum"});
	});
	test.done();
};



