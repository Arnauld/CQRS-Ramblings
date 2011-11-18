exports.aggregate_root = function(identifier, inherits, features) {
	return {
		type : "aggregage_root",
		name : identifier,
		inherits : inherits,
		features : features
	};
};

exports.method = function(identifier, arguments, is_factory) {
	var type = "def"
	if(is_factory)
		type = "factory"
	return {
		type : type,
		name : identifier,
		arguments : arguments
	};
};

exports.argument = function(identifier, datatype) {
	return {
		name:identifier,
		type:datatype
	};
}