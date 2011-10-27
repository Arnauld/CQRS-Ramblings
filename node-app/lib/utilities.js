
var mixin = function(dst, functions) {
    var prop;
    for(prop in functions) {
        if(functions.hasOwnProperty(prop)) {
            dst[prop] = functions[prop];
        }
    }
};

exports.mixin = mixin;

exports.trim = function(string) {
	return string.replace(/^\s+/, '').replace(/\s+$/, '');
};

exports.starts_with = function(string, prefix) {
	return string.lastIndexOf(prefix, 0) === 0;	
};

exports.contains = function(string, searched) {
	return string.indexOf(searched) !== -1;	
};
