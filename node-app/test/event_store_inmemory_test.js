var es = require('../lib/event_store'),
	exception = require('../lib/exceptions');

function Event() {}
var new_event = function(id) {
	var event = new Event();
	event.id = id;
	return event;
};

exports["InMemoryEventStore save new aggregate if version is '0'"] = function (test) {
	var events = [
		new_event("a"),
		new_event("b"),
		new_event("c"),
		new_event("d")
	];

	var store = new es.InMemoryEventStore();
	store.save_events("0001", events, 0);

	var read = [];
	store.load_events("0001", function(event) {
		read[read.length] = event;
	});

	test.equal(read[0].id, "a");
	test.equal(read[1].id, "b");
	test.equal(read[2].id, "c");
	test.equal(read[3].id, "d");
    test.done();
};

exports["InMemoryEventStore cannot save unknown aggregate (or new) if version is not '0'"] = function (test) {
	var events = [
		new_event("a"),
		new_event("b"),
		new_event("c"),
		new_event("d")
	];

	var store = new es.InMemoryEventStore();
	test.throws(function() {
		store.save_events("0001", events, 2);
	});
    test.done();
};

exports["InMemoryEventStore can save existing aggregate if version is the expected one"] = function (test) {
	var events1 = [
		new_event("a"),
		new_event("b"),
		new_event("c"),
		new_event("d")
	];

	var store = new es.InMemoryEventStore();
	store.save_events("0001", events1, 0);

	var events2 = [
		new_event("e"),
		new_event("f"),
		new_event("g"),
		new_event("h")
	];
	store.save_events("0001", events2, 4);

	var read = [];
	store.load_events("0001", function(event) {
		read[read.length] = event;
	});

	test.equal(read[0].id, "a");
	test.equal(read[1].id, "b");
	test.equal(read[2].id, "c");
	test.equal(read[3].id, "d");
	test.equal(read[4].id, "e");
	test.equal(read[5].id, "f");
	test.equal(read[6].id, "g");
	test.equal(read[7].id, "h");
    test.done();
};

exports["InMemoryEventStore cannot save existing aggregate if version is not the expected one"] = function (test) {
	var events1 = [
		new_event("a"),
		new_event("b"),
		new_event("c"),
		new_event("d")
	];

	var store = new es.InMemoryEventStore();
	store.save_events("0001", events1, 0);

	var events2 = [
		new_event("e"),
		new_event("f"),
		new_event("g"),
		new_event("h")
	];
	test.throws(function() {
		store.save_events("0001", events2, 7);
	}, exception.OptimisticLockingException);
    test.done();
};


exports["InMemoryEventStore can load existing aggregate's events starting from a specified version"] = function (test) {
	var events = [
		new_event("a"), // v1
		new_event("b"), // v2
		new_event("c"), // v3
		new_event("d")  // v4
	];

	var store = new es.InMemoryEventStore();
	store.save_events("0001", events, 0);

	var read = [];
	store.load_events("0001", function(event) {
		read[read.length] = event;
	}, 3);

	test.equal(read[0].id, "c");
	test.equal(read[1].id, "d");
    test.done();
};
