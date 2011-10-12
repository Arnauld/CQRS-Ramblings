/**
 * User
 */
var User = function(screen_name) {
	this._screen_name = screen_name;
};

User.prototype = {
	screen_name : function() { return _screen_name; }
};

/**
 *  Project
 */
var Project = function(project_name) {
	this._name = project_name;
	this._uuid = require('node-uuid')();
};

Project.prototype = {
	name : function () { return this._name; },
	uuid : function () { return this._uuid; }
};

exports.create_project = function(project_name) {
	return new Project(project_name);
};

exports.Project = Project;

/**
 *  Backlog
 */
