var underscore = require('underscore'),
    fs = require('fs'),
    st = require('../prototype-lite'),
    Shared = require('../shared'),
    Utils  = require('./view_utils');

var generate_event_name = exports.generate_event_name = function(model, feature) {
    var parts = Shared.split_words(feature.name).map(Shared.toLowerCase);
    var verb = parts[0];
    verb = Shared.past_tense(verb);

    var remaining_index = 1;
    var to_mode = (parts.length>1 && parts[1]==="to");
    if(to_mode) {
        remaining_index++;
    }
    var remaining = parts.slice(remaining_index).join("-");
    var event_name;
    if(to_mode) {
        event_name = model.name + "-" + verb + "-to-" + remaining + "-Event";
    } else {
        event_name = model.name + "-" + remaining + "-" + verb + "-Event";
    }
    return event_name.dasherize().camelize();
};

var generate_event_type = exports.generate_event_type = function(model, feature) {
    return generate_event_name(model, feature).underscore();
};

var generate_event_fields = exports.generate_event_fields = function(model, feature) {
    // event belongs to the model
    // one must be sure the model's id is the first argument
    var model_id = Utils.model_id_variable_name(model);
    var id_exists = false;
    var fields    = feature.arguments.map(function(argument) {
        var field_name = argument.name.underscore();
        if(field_name === model_id) {
            id_exists = true;
        }
        return {
            name     : field_name,
            datatype : argument.datatype
        };
    });
    if(!id_exists) {
        fields.unshift({
            name     : model_id,
            datatype : Utils.model_id_datatype(model)
        });
    }
    return fields;
};

var generate_field_assignments_from_event = exports.generate_field_assignments_from_event = function(model, feature) {
    var assignments = [];
    var fields = model.fields();
    var event_fields = generate_event_fields(model, feature);

    event_fields.forEach(function(event_field) {
        var matching_field = underscore.find(fields, function(field) {
            var matching = Utils.are_fields_matching(model, field, event_field); 
            return matching;
        });
        if(matching_field) {
            assignments.push({
                on_identifier : false,
                event_field   : event_field,
                field         : matching_field
            });
        }
        else {
            var model_id = Utils.model_id_variable_name(model);
            if(event_field.name===model_id) {
                // setup the built in id
                assignments.unshift({
                    on_identifier : true,
                    event_field   : event_field
                });
            }
        }
    });

    return assignments;
};

var generate_on_event_method_name = exports.generate_on_event_method_name = function(model, feature) {
    return "on_" + feature.name.underscore();   
};

var generate_event_handler = exports.generate_event_handler = function(model, feature) {
    var view = {
        on_event_method_name : generate_on_event_method_name(model, feature),
        field_assignments    : generate_field_assignments_from_event(model, feature)
    };
    return Utils.view_of(feature, view);
};

/**
 *
 */
var to_event_view = exports.to_event_view = function(model, feature) {
    if(!feature.is_factory() && !feature.is_def()) {
        throw "Incompatible feature type";
    }

    var view = {
        name          : generate_event_name(model, feature),
        event_type    : generate_event_type(model, feature),
        event_handler : generate_event_handler(model, feature),
        fields        : Utils.add_iteration_flags(generate_event_fields(model, feature), "field"),
        field_names   : function() { return this.fields.map(Utils.field_to_name);}
    };
    return Utils.view_of(feature, view);
};


exports.transform = function(model, output) {
    var template = fs.readFileSync(__dirname + "/event.template", 'utf8');
    var compiled = underscore.template(template);
    var functor  = function(feature) {
        var event_view = to_event_view(model, feature);
        if(event_view) {
            output(compiled(event_view));
        }
    };
    model.factories().forEach(functor);
    model.defs().forEach(functor);
};


