var nutil = require('util'),
    misc  = require('./utilities'),
    exception = require('./exceptions');

/**
 *  EventStore
 */
// public methods
var event_store_methods = {
	save_events: function(aggregate_id, events, expected_version) {
		throw new exception.UnsupportedException("EventStore#save_events");
	},

	load_events: function(aggregate_id, callback, from_version) {
		throw new exception.UnsupportedException("EventStore#load_events");
	}
};

function EventStore() {}
misc.mixin(EventStore.prototype, event_store_methods);

exports.EventStore = EventStore;


/**
 *  InMemoryEventStore
 */
function InMemoryAggregate () {
	this.events = [];
}
InMemoryAggregate.prototype.append_events = function(events) {
	var $events = this.events;
	var i;
	for(i=0; i<events.length; i++) {
		$events[$events.length] = events[i];
	}
};
InMemoryAggregate.prototype.version = function() {
	return this.events.length;
}

var in_memory_methods = {
	//
	save_events: function(aggregate_id, events, expected_version) {
		var aggregate = this.aggregates[aggregate_id];
		if(aggregate) {
			if(aggregate.version() !== expected_version) {
				throw new exception.OptimisticLockingException(aggregate_id, aggregate.version(), expected_version);
			}
			aggregate.append_events(events);
		}
		else if(expected_version === 0) {
			aggregate = new InMemoryAggregate();
			aggregate.append_events(events);
			this.aggregates[aggregate_id] = aggregate;
		}
		else {
			throw new exception.AggregateNotFound(aggregate_id);
		}
	},

	load_events: function(aggregate_id, callback, from_version) {
		var from_index = (from_version || 1) - 1;
		var aggregate = this.aggregates[aggregate_id];
		if(aggregate) {
			var events = aggregate.events;
            var length = events.length;
			for(var i= from_index; i < length; i++)
			{
			     callback(events[i]);
			}
		}
		else {
			throw new exception.AggregateNotFound(aggregate_id);
		}
	}
};

function InMemoryEventStore() {
	this.aggregates = [];
}
nutil.inherits(InMemoryEventStore, EventStore);
misc.mixin(InMemoryEventStore.prototype, in_memory_methods);

exports.InMemoryEventStore=InMemoryEventStore;





