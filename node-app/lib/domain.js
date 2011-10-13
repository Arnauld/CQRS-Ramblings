var uuid = require('node-uuid');

/**
 *  Project
 */
var ProjectCreated = function(project_id, project_name) {
	// wrapping functions to make values *immutables*
    this.event_type   = function() { return "project_created"; };
	this.project_name = function() { return project_name; };
	this.project_id   = function() { return project_id;   };
};

var Project = function(project_id, project_name) {
	this.apply(new ProjectCreated(project_id, project_name));
};

// public method
Project.prototype = {
	name : function () { return this._name; },
	uuid : function () { return this._uuid; },
	events: function () { return this._events; },
	apply: function (event) {
		switch(event.event_type()) {
			case "project_created" :
				this._name = event.project_name();
				this._uuid = event.project_id();
				break;
			default:
				throw new Error("Unknown event type: " + event.event_type());
		}

		// still there means, the event was correctly handled, thus keep it!
		if(typeof this._events === 'undefined') {
			this._events = [];
		}
		this._events[this._events.length] = event;
	}
};

exports.create_project = function(project_name) {
	return new Project(uuid(), project_name);
};

exports.Project = Project;
