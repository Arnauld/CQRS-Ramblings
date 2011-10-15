/**
 *  Aggregate Root
 */
function AggregateRoot() {}
exports.AggregateRoot = AggregateRoot;

// public methods
AggregateRoot.prototype = {
	event_handlers : {},
	uuid  : function () { return this._uuid; },
	events: function () { return this._events; },
	apply_event : function (event) {
		var handler = this.event_handlers["on_"+event.event_type()];
		if(typeof handler === 'undefined') {
			throw new Error("Unknown event type: <" + event.event_type() + ">");
		}
		handler.call(this, event);

		// still there means, the event was correctly handled, thus keep it!
		if(typeof this._events === 'undefined') {
			this._events = [];
		}
		this._events[this._events.length] = event;
	},
	load_from_history: function(events) {
		var $this = this;
		events.forEach(function(event) {
			$this.apply_event(event);
		});
	}
};
