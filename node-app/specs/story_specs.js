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
    }/*,
    'A new story created with its name only' : {
        topic: function () { 
            return story.create({name:"mccallum"});
        },

        'should return an instance of Story' : function(story) {
            assert.instanceOf (story, story.Story);
        },

        'should have the specified name': function (story) {
            assert.equal (story.name(), 'mccallum');
        },

        'should have an empty description': function (story) {
            assert.equal (story.description(), '');
        },

        'should have a complexity undefined': function (story) {
            assert.equal (typeof story.complexity() === 'undefined');
        },

        'should have a business value undefined': function (story) {
            assert.equal (typeof story.business_value() === 'undefined');
        },


        'should have a generated uuid': function (story) {
            assert.equal(UUID_PATTERN.test(story.uuid()), true);
        }
    },
    'New stories': {
        topic: function () { 
            return [ story.create({name:"mccallum"}), story.create({name:"mccallum"})];
        },

        'should have differents uuid': function (result) {
            assert.notEqual (result[0].uuid(), result[1].uuid());
        }
    }*/
}).export(module); // Export the Suite