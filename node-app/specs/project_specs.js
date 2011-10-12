var vows = require('vows'),
    assert = require('assert');

var domain = require('../lib/domain');

var UUID_PATTERN = /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{8}/

vows.describe('Project').addBatch({
    'A new project created with a given name': {
        topic: function () { 
            return domain.create_project("mccallum");
        },

        'should return an instance of Project' : function(project) {
            assert.instanceOf (project, domain.Project);
        },

        'should have the specified name': function (project) {
            assert.equal (project.name(), 'mccallum');
        },

        'and a generated uuid': function (project) {
            assert.equal(UUID_PATTERN.test(project.uuid()), true);
        }
    },
    'New projects': {
        topic: function () { 
            return [ domain.create_project("mccallum"), domain.create_project("mccallum")];
        },

        'should have differents uuid': function (result) {
            assert.notEqual (result[0].uuid(), result[1].uuid());
        }
    }
}).export(module); // Export the Suite