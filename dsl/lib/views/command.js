var underscore = require('underscore'),
    fs = require('fs'),
    st = require('../prototype-lite'),
    Shared = require('../shared'),
    Utils  = require('./view_utils'),
    Event  = require('./event');


var generate_command_name = exports.generate_command_name = function(model, feature) {
    return (feature.name + "-" + model.name + "-Command").dasherize().capitalize().camelize();
};

var generate_command_type = exports.generate_command_type = function(model, feature) {
    return generate_command_name(model, feature).underscore();
};


var generate_on_command_method_name = exports.generate_on_command_method_name = function(model, feature) {
    return "on_" + feature.name.underscore();   
};

var generate_command_handler_name = exports.generate_command_handler_name = function(model, feature) {
    return generate_command_name(model, feature) + "Handler";
};

var generate_command_handler = exports.generate_event_handler = function(model, feature) {
    var view = {
        name                   : generate_command_handler_name(model, feature),
        on_command_method_name : generate_on_command_method_name(model, feature)
    };
    return Utils.view_of(feature, view);
};

/**
 *
 */
var to_command_view = exports.to_command_view = function(model, feature) {
    if(!feature.is_factory() && !feature.is_def()) {
        throw "Incompatible feature type";
    }

    var view = {
        name            : generate_command_name(model, feature),
        command_type    : generate_command_type(model, feature),
        command_handler : generate_command_handler(model, feature),
        fields          : Utils.add_iteration_flags(Event.generate_event_fields(model, feature), "field"),
        field_names     : function() { return this.fields.map(Utils.field_to_name);}
    };
    return Utils.view_of(feature, view);
};

exports.transform = function(model, output) {
    var template = fs.readFileSync(__dirname + "/command.template", 'utf8');
    var compiled = underscore.template(template);
    var functor  = function(feature) {
        var command_view = to_command_view(model, feature);
        if(command_view) {
            output(compiled(command_view));
        }
    };
    model.factories().forEach(functor);
    model.defs().forEach(functor);
};
