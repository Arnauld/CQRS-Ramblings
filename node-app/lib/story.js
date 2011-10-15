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

var StoryCreated = function(project_id, story_id, story_name, story_description, complexity, business_value) {
    this.event_type = to_f("story_created");
    this.project_id = to_f(project_id);
    this.story_id   = to_f(story_id);
    this.story_name = to_f(story_name);
    this.story_description = to_f(story_description);
    this.complexity = to_f(complexity);
    this.business_value = to_f(business_value);
};

exports.StoryCreated = StoryCreated;

/**
 *  Story
 */
var methods = {
	event_handlers : {
		on_story_created: function(event) {
			this._project_id = event.project_id();
			this._uuid = event.story_id();
			this._name = event.story_name();
			this._desc = event.story_description();
			this._complexity = event.complexity();
			this._business_value = event.business_value();
		}
	},
	project_id : function () {
		return this._project_id;	
	},
	name : function () {
		return this._name;
	},
	description : function () {
		return this._desc;
	},
	complexity : function () {
		return this._complexity;
	},
	business_value : function () {
		return this._business_value;
	}
};

function Story() {}
nutil.inherits(Story, aroot.AggregateRoot);
misc.mixin(Story.prototype, methods);
exports.Story = Story;

exports.create = function(data) {
    if(typeof data.project_id === 'undefined') {
    	throw new Error("Missing story's <project_id>!");
    }
    if(typeof data.name === 'undefined') {
    	throw new Error("Missing story's <name>!");
    }

	var story = new Story();
	story.apply_event(new StoryCreated(data.project_id, 
		uuid(), data.name, data.description, data.complexity, data.business_value));
	return story;
};
