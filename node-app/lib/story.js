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

var StoryRenamed = function(story_id, new_story_name) {
    this.event_type     = to_f("story_renamed");
    this.new_story_name = to_f(new_story_name);
    this.story_id       = to_f(story_id);
};
exports.StoryRenamed = StoryRenamed;

var StoryDescriptionChanged = function(story_id, new_description) {
    this.event_type      = to_f("story_description_changed");
    this.new_description = to_f(new_description);
    this.story_id        = to_f(story_id);
};
exports.StoryDescriptionChanged = StoryDescriptionChanged;

var StoryComplexityChanged = function(story_id, new_complexity) {
    this.event_type     = to_f("story_complexity_changed");
    this.new_complexity = to_f(new_complexity);
    this.story_id       = to_f(story_id);
};
exports.StoryComplexityChanged = StoryComplexityChanged;

var StoryBusinessValueChanged = function(story_id, new_business_value) {
    this.event_type     = to_f("story_business_value_changed");
    this.new_business_value = to_f(new_business_value);
    this.story_id       = to_f(story_id);
};
exports.StoryBusinessValueChanged = StoryBusinessValueChanged;

var StoryCommentAdded = function(story_id, new_comment) {
    this.event_type = to_f("story_comment_added");
    this.content    = to_f(new_comment);
    this.story_id   = to_f(story_id);
};
exports.StoryCommentAdded = StoryCommentAdded;


/**
 *  Story
 */
var methods = {
    event_handlers : {
        on_story_created: function(event) {
            this._project_id = event.project_id();
            this._uuid = event.story_id();
            this._name = event.story_name();
            this._description = event.story_description();
            this._complexity = event.complexity();
            this._business_value = event.business_value();
        },
        on_story_renamed: function(event) {
            this._name = event.new_story_name();
        },
        on_story_description_changed: function(event) {
            this._description = event.new_description();
        },
        on_story_complexity_changed: function(event) {
            this._complexity = event.new_complexity();
        },
        on_story_business_value_changed: function(event) {
            this._business_value = event.new_business_value();
        },
        on_story_comment_added: function (event) {}
    },
    project_id : function () {
        return this._project_id;    
    },
    name : function () {
        return this._name;
    },
    description : function () {
        return this._description;
    },
    complexity : function () {
        return this._complexity;
    },
    business_value : function () {
        return this._business_value;
    },
    rename : function(new_name) {
        this.apply_event(new StoryRenamed(this._uuid, new_name));
    },
    change_description: function(new_description) {
        this.apply_event(new StoryDescriptionChanged(this._uuid, new_description)); 
    },
    change_complexity: function(new_complexity) {
        this.apply_event(new StoryComplexityChanged(this._uuid, new_complexity));   
    },
    change_business_value: function(new_business_value) {
        this.apply_event(new StoryBusinessValueChanged(this._uuid, new_business_value));    
    },
    add_comment: function(new_comment) {
        this.apply_event(new StoryCommentAdded(this._uuid, new_comment));
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

exports.load_from_history = function(events) {
    var story = new Story();
    story.load_from_history(events);
    return story;
};

