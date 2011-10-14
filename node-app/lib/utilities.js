
var mixin = function(dst, functions) {
    var prop;
    for(prop in functions) {
        if(functions.hasOwnProperty(prop)) {
            dst[prop] = functions[prop];
        }
    }
};

exports.mixin = mixin;
