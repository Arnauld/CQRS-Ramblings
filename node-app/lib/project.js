var uuid  = require('node-uuid'),
    aroot = require('./aggregate_root'),
    nutil = require('util'),
    misc  = require('./utilities');

var to_f = function(value) { 
	return function () { 
		return value; 
	};
};

/**
 *  Events
 */
var ProjectCreated = function(project_id, project_name) {
    this.event_type   = to_f("project_created");
	this.project_name = to_f(project_name);
	this.project_id   = to_f(project_id);
};

exports.ProjectCreated = ProjectCreated;

var ProjectRenamed = function(project_id, new_project_name) {
    this.event_type       = to_f("project_renamed");
	this.new_project_name = to_f(new_project_name);
	this.project_id       = to_f(project_id);
};

exports.ProjectRenamed = ProjectRenamed;

/**
 *  Project
 */
// public methods
var methods = {
	event_handlers : {
		on_project_created: function(event) {
			this._name = event.project_name();
			this._uuid = event.project_id();
		},
		on_project_renamed: function(event) {
			this._name = event.new_project_name();
		}
	},
	name : function () {
		return this._name;
	},
	rename : function(new_name) {
		this.apply_event(new ProjectRenamed(this._uuid, new_name));	
	}
};

function Project() {}
nutil.inherits(Project, aroot.AggregateRoot);
misc.mixin(Project.prototype, methods);

exports.Project = Project;

exports.create = function(project_name) {
	var project = new Project();
	project.apply_event(new ProjectCreated(uuid(), project_name));
	return project;
};

exports.load_from_history = function(events) {
	var project = new Project();
	project.load_from_history(events);
	return project;
};
