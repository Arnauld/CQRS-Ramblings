var uuid = require('node-uuid');

var to_f = function(value) { 
	return function () { 
		return value; 
	};
};

/**
 *  Events
 */
var ProjectCreated = function(project_id, project_name) {
	// wrapping functions to make values *immutables*
    this.event_type   = to_f("project_created");
	this.project_name = to_f(project_name);
	this.project_id   = to_f(project_id);
};

exports.ProjectCreated = ProjectCreated;

var ProjectRenamed = function(project_id, new_project_name) {
	// wrapping functions to make values *immutables*
    this.event_type       = to_f("project_renamed");
	this.new_project_name = to_f(new_project_name);
	this.project_id       = to_f(project_id);
};

exports.ProjectRenamed = ProjectRenamed;

/**
 *  Project
 */
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
			case "project_renamed" :
				this._name = event.new_project_name();
				break;
			default:
				throw new Error("Unknown event type: " + event.event_type());
		}

		// still there means, the event was correctly handled, thus keep it!
		if(typeof this._events === 'undefined') {
			this._events = [];
		}
		this._events[this._events.length] = event;
	},
	load_from_history: function(events) {
		var $this = this;
		events.forEach(function(event) {
			$this.apply(event);
		});
	},
	rename: function(new_name) {
		this.apply(new ProjectRenamed(this._uuid, new_name));	
	}
};

exports.create = function(project_name) {
	return new Project(uuid(), project_name);
};

exports.load_from_history = function(events) {
	var project = new Project();
	project.load_from_history(events);
	return project;
};

exports.Project = Project;
