var ar  = require("../lib/aggregate_root");

exports["aggregate root should be empty by default"] = function (test) {
	var aggregate = new ar.AggregateRoot();
	test.ok(typeof aggregate._uuid   === 'undefined');
	test.ok(typeof aggregate._events === 'undefined');
    test.done();
};

exports["aggregate root must have the 'uuid()' method"] = function (test) {
	var aggregate = new ar.AggregateRoot();
	aggregate._uuid = "0102011303112";
	test.equal(aggregate.uuid(), "0102011303112");
    test.done();
};

exports["aggregate root must have the 'events()' method"] = function (test) {
	var aggregate = new ar.AggregateRoot();
	aggregate._uuid = "0102011303112";
	test.ok(typeof aggregate.events() === 'undefined'); // method exists but returns nothing :)
    test.done();
};

exports["aggregate root must have the 'apply_event()' method"] = function (test) {
	var aggregate = new ar.AggregateRoot();
	aggregate.event_handlers = {
		"on_my_event_type" : function (event) {}	
	};

	var event = { "event_type": function() {
		return "my_event_type";
	}};
	aggregate.apply_event(event);
    test.done();
};

exports["aggregate root must have the 'apply_event()' method that append the event to the history"] = function (test) {
	var aggregate = new ar.AggregateRoot();
	aggregate.event_handlers = {
		"on_my_event_type" : function (event) {}	
	};

	var event = { "event_type": function() {
		return "my_event_type";
	}};
	aggregate.apply_event(event);
	test.ok(aggregate.events() instanceof Array);
	test.equal(aggregate.events()[0], event);
    test.done();
};

exports["aggregate root must have the 'last_event()' method that return 'undefined' if the history is empty"] = function (test) {
	var aggregate = new ar.AggregateRoot();
	test.ok(typeof aggregate.last_event()   === 'undefined');

	aggregate._events = [];
	test.ok(typeof aggregate.last_event()   === 'undefined');
    test.done();
};

exports["aggregate root must have the 'last_event()' method working with one event in history"] = function (test) {
	var aggregate = new ar.AggregateRoot();
	aggregate.event_handlers = {
		"on_my_event_type" : function (event) {}	
	};

	var event = { "event_type": function() {
		return "my_event_type";
	}};
	aggregate.apply_event(event);
	test.equal(aggregate.last_event(), event);
    test.done();
};

exports["aggregate root must have the 'last_event()' method working with two events in history"] = function (test) {
	var aggregate = new ar.AggregateRoot();
	aggregate.event_handlers = {
		"on_my_event_type" : function (event) {}	
	};

	var event1 = { 
		"event_type": function() {
			return "my_event_type";
		},
		id: 1
	};
	var event2 = { 
		"event_type": function() {
			return "my_event_type";
		},
		id: 2
	};
	aggregate.apply_event(event1);
	aggregate.apply_event(event2);
	test.equal(aggregate.last_event(), event2);
    test.done();
};












