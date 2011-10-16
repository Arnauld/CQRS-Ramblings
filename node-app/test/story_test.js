var story  = require("../lib/story");
var uuid = require('node-uuid');
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

exports["renaming a story must change its name according to new one"] = function (test) {
	var st = story.create({name:"mccallum", project_id:"cafebabe-3550"});

	st.rename("travis");
	test.equal(st.name(), "travis");
	test.done();
};

exports["renaming a story must add an `event` in its history of type 'story_renamed'"] = function (test) {
	var st = story.create({name:"mccallum", project_id:"cafebabe-3550"});
	st.rename("travis");

	var uuid = st.uuid();

	var events = st.events();
	test.ok(events instanceof Array);
	test.equal(events.length, 2);
	test.equal(events[0].event_type(), "story_created");
	test.equal(events[1].event_type(), "story_renamed");
	test.equal(events[1].story_id(),   uuid);
	test.equal(events[1].new_story_name(), "travis");
	test.done();
};

exports["a story can be reload from a simple history"] = function (test) {
	var project_id = uuid();
	var story_id = uuid();
	var history = [ 
		new story.StoryCreated(project_id, story_id, "mccallum", "nice description", 7, 100),
		new story.StoryRenamed(story_id, "travis"),
		new story.StoryDescriptionChanged(story_id, "better description"),
		new story.StoryComplexityChanged(story_id, 13)
	];
	var st = story.load_from_history(history);

	test.equal(st.uuid(), story_id);
	test.equal(st.project_id(), project_id);
	test.equal(st.name(), "travis");
	test.equal(st.description(), "better description");
	test.equal(st.complexity(), 13);
	test.done();
};

exports["changing the description of a story must change its description according to new one"] = function (test) {
	var st = story.create({name:"mccallum", project_id:"cafebabe-3550"});
	st.change_description("nice description");

	test.equal(st.description(), "nice description");
	test.done();
};

exports["changing the description of a story must add an `event` in its history of type 'story_description_changed'"] = function (test) {
	var st = story.create({name:"mccallum", project_id:"cafebabe-3550"});
	st.change_description("nice description");

	var uuid = st.uuid();

	var events = st.events();
	test.ok(events instanceof Array);
	test.equal(events.length, 2);
	test.equal(events[0].event_type(), "story_created");
	test.equal(events[1].event_type(), "story_description_changed");
	test.equal(events[1].story_id(),   uuid);
	test.equal(events[1].new_description(), "nice description");
	test.done();
};

exports["changing the complexity of a story must change its complexity according to new one"] = function (test) {
	var st = story.create({name:"mccallum", project_id:"cafebabe-3550"});
	st.change_complexity(5);

	test.equal(st.complexity(), 5);
	test.done();
};

exports["changing the complexity of a story must add an `event` in its history of type 'story_complexity_changed'"] = function (test) {
	var st = story.create({name:"mccallum", project_id:"cafebabe-3550"});
	st.change_complexity(5);

	var uuid = st.uuid();

	var events = st.events();
	test.ok(events instanceof Array);
	test.equal(events.length, 2);
	test.equal(events[0].event_type(), "story_created");
	test.equal(events[1].event_type(), "story_complexity_changed");
	test.equal(events[1].story_id(),   uuid);
	test.equal(events[1].new_complexity(),5);
	test.done();
};

exports["changing the business_value of a story must change its business_value according to new one"] = function (test) {
	var st = story.create({name:"mccallum", project_id:"cafebabe-3550"});
	st.change_business_value(5);

	test.equal(st.business_value(), 5);
	test.done();
};

exports["changing the business_value of a story must add an `event` in its history of type 'story_business_value_changed'"] = function (test) {
	var st = story.create({name:"mccallum", project_id:"cafebabe-3550"});
	st.change_business_value(5);

	var uuid = st.uuid();

	var events = st.events();
	test.ok(events instanceof Array);
	test.equal(events.length, 2);
	test.equal(events[0].event_type(), "story_created");
	test.equal(events[1].event_type(), "story_business_value_changed");
	test.equal(events[1].story_id(),   uuid);
	test.equal(events[1].new_business_value(),5);
	test.done();
};

exports["adding a comment to a story must add an 'event' in its history of type 'story_comment_added'"] = function(test) {
	var st = story.create({name:"mccallum", project_id:"cafebabe-3550"});
	st.add_comment("Make the implicit explicit");

	var uuid = st.uuid();

	var events = st.events();
	test.ok(events instanceof Array);
	test.equal(events.length, 2);
	test.equal(events[0].event_type(), "story_created");
	test.equal(events[1].event_type(), "story_comment_added");
	test.equal(events[1].story_id(),   uuid);
	test.equal(events[1].content(),    "Make the implicit explicit");
	test.done();
};
