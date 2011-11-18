var parser = require("./parser").parser;
// set parser's shared scope
parser.yy = require("./scope");

// returns the JSON object
var parse = exports.parse = function (input) {
    return parser.parse(input);
};

// returns the stringified JSON object
var compile = exports.compile = function (input, indent) {
    return JSON.stringify(parse(input), null, indent||"    ");
};

var main = exports.main = function (args) {
    var fs = require("fs");
    if (!args[1]) {
        throw new Error("Usage: " + args[0] + " <cqrs-file>");
    }
    var input = fs.readFileSync(args[1], 'utf8'),
        source = compile(input);

    console.log(source);
};

main(process.argv.slice(1));