var vows = require('vows'),
    assert = require('assert');

var story = require('../lib/story');

var UUID_PATTERN = /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{8}/;

vows.describe('Story').addBatch({
    'A new story': {
        topic: function () {
            return story.create({
                project_id: "cafebabe-3550",
                name: "As a developer, I want to known NodeJS so that i increase my knowledge", 
                description: "By learning NodeJS, the developer will be able to undestand its success", 
                complexity: 7,
                business_value: 120
            });
        },

        'should return an instance of Story' : function(st) {
            assert.instanceOf (st, story.Story);
        },

        'should have the specified name': function (story) {
            assert.equal (story.name(), 'As a developer, I want to known NodeJS so that i increase my knowledge');
        },

        'should have the specified description': function (story) {
            assert.equal (story.description(), 'By learning NodeJS, the developer will be able to undestand its success');  
        },

        'should have the specified complexity': function (story) {
            assert.equal (story.complexity(), 7);  
        },

        'should have the specified business value': function (story) {
            assert.equal (story.business_value(), 120);  
        },

        'should have a generated uuid': function (story) {
            assert.equal(UUID_PATTERN.test(story.uuid()), true);
        }
    },
    'New stories': {
        topic: function () { 
            var story1 = story.create({
                project_id: "cafebabe-3550",
                name:"mccallum"});
            var story2 = story.create({
                project_id: "cafebabe-3550",
                name:"mccallum"});
            return [ story1, story2 ];
        },

        'should have differents uuid': function (result) {
            assert.notEqual (result[0].uuid(), result[1].uuid());
        }
    },
    'Story' : {
        topic: function () {
            return story.create({
                project_id: "cafebabe-3550",
                name: "As a developer, I want to known NodeJS so that i increase my knowledge", 
            });
        },
        'can be improved by adding comment on it' : function(story) {
            var CONTENT = "NodeJS looks promising, not only for application but also as a tool to test and learn javascipt";
            story.add_comment(CONTENT);
            var last_event = story.last_event();
            assert.equal (last_event.event_type(), "story_comment_added");
            assert.equal (last_event.content(), CONTENT);
        }
    }
}).export(module); // Export the Suite




