var underscore = require('underscore'),
	fs = require('fs'),
	st = require('../prototype-lite'),
	Shared = require('../shared'),
	Utils  = require('./view_utils'),
	Event  = require('./event');

var generate_event_views = exports.generate_event_views = function(model) {
	var event_views = [];
	var functor  = function(feature) {
		var event_view = Event.to_event_view(model, feature);
		event_views.push(event_view);
	};

	model.factories().forEach(functor);
	model.defs().forEach(functor);
	return event_views;
};

var argument_to_name = function(field) {
                            return field.name;
                        };


var generate_def_views = exports.generate_def_views = function(model) {
	var def_views = [];
	var functor  = function(def) {
		var def_view = {
			method_name : Utils.method_name(def),
			event_view  : Event.to_event_view(model, def),
			argument_names : function() { return def.arguments.map(argument_to_name); }
		};
		def_views.push(Utils.view_of(def, def_view));
	};

	model.defs().forEach(functor);
	return def_views;
};

var generate_field_views = exports.generate_field_views = function(model) {
	var field_views = [];
	var functor  = function(field) {
		var field_view = {
			field_name : Utils.field_name(field)
		};
		field_views.push(Utils.view_of(field, field_view));
	};

	model.fields().forEach(functor);
	return field_views;
};

var generate_factory_views = exports.generate_factory_views = function(model) {
	var factory_views = [];
	var functor  = function(factory) {
		var factory_view = {
			method_name : Utils.method_name(factory),
			event_view  : Event.to_event_view(model, factory),
		};
		factory_views.push(Utils.view_of(factory, factory_view));
	};

	model.factories().forEach(functor);
	return factory_views;
};

var to_aggregate_root_view = exports.to_aggregate_root_view = function(model) {
	var view = {
		name           : Utils.model_name(model),
		variable_name  : Utils.model_variable_name(model),
		def_views      : Utils.add_iteration_flags(generate_def_views(model), "def_view"),
		field_views    : Utils.add_iteration_flags(generate_field_views(model), "field_view"),
		factory_views  : Utils.add_iteration_flags(generate_factory_views(model), "factory_view"),
		event_views    : Utils.add_iteration_flags(generate_event_views(model), "event_view")
	};
	return Utils.view_of(model, view);
};

exports.transform = function(model, output) {
	if(model.type !== "aggregate_root")
		return;
	
    var template = fs.readFileSync(__dirname + "/aggregate_root.template", 'utf8');
    var view = to_aggregate_root_view(model);
    var compiled = underscore.template(template);
    output(compiled(view));
};


