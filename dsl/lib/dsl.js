var parser = require("./parser").parser;
// set parser's shared scope
parser.yy = require("./scope");

// returns the JSON object
var parse = exports.parse = function (input) {
    return parser.parse(input);
};

var toString = function(input, indent) {
    return JSON.stringify(input, null, indent||"    ");
};

var asArray = function(model) {
    if(typeof model === 'object' && model instanceof Array) {
        return model;
    }
    else {
        return [model];
    }
};

var main = exports.main = function (args) {
    var fs  = require("fs"),
        str = require("./prototype-lite");
    if (!args[1]) {
        throw new Error("Usage: " + args[0] + " <cqrs-file> [<transformation>]");
    }
    var input  = fs.readFileSync(args[1], 'utf8');
    var parsed = parse(input);

    if(args[2]) {
        var output    = console.log;
        var transform = require('./'+args[2]).transform;
        asArray(parsed).forEach(function(part) {
            transform(part, output);
        });
    }
    else {
        console.log(toString(parsed));        
    }
};

main(process.argv.slice(1));