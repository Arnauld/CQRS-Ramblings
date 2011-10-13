var uuid = require('node-uuid');

/**
 *  Project
 */
var Project = function(uuid, project_name) {
	this._name = project_name;
	this._uuid = uuid;
};

Project.prototype = {
	name : function () { return this._name; },
	uuid : function () { return this._uuid; }
};

exports.create_project = function(project_name) {
	return new Project(uuid(), project_name);
};

exports.Project = Project;

/**
 *  Backlog
 */
