var proto = require('./prototype-lite');

var field_filter   = exports.field_filter   = function(f) { return f.is_field(); };
var factory_filter = exports.factory_filter = function(f) { return f.is_factory(); };
var def_filter     = exports.factory_filter = function(f) { return f.is_def(); };


exports.aggregate_root = function(identifier, inherits, features) {
	return {
		type : "aggregate_root",
		name : identifier,
		inherits : inherits,
		features : features,
		fields   : function() { return this.features.filter(field_filter);   },
		factories: function() { return this.features.filter(factory_filter); },
		defs     : function() { return this.features.filter(def_filter);     }
	};
};

function Feature(data) {
	proto.extend(this, data);	
}

proto.extend(Feature.prototype, {
	is_field    : function() { return this.type==="field"; },
	is_factory  : function() { return this.type==="factory"; },
	is_def      : function() { return this.type==="def"; },
	is_method   : function() { return this.type==="factory" || this.type==="def"; },
	arguments   : []
});
exports.Feature = Feature;

exports.factory = function(identifier, arguments) {
	return new Feature({
		type : "factory",
		name : identifier,
		description : identifier,
		arguments   : arguments,
	});
};

exports.def = function(identifier, arguments, is_factory) {
	return new Feature({
		type : "def",
		name : identifier,
		description : identifier,
		arguments   : arguments
	});
};

exports.field = function(identifier, datatype) {
	return new Feature({
		type     : "field",
		name     : identifier,
		datatype : datatype,
	});
};

exports.argument = function(identifier, datatype) {
	return {
		name      : identifier,
		datatype  : datatype
	};
};
