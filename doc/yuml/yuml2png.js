var fs   = require('fs'),
    exec = require('child_process').exec
    ;

function endsWith(string, pattern) {
	var d = string.length - pattern.length;
	// We use `indexOf` instead of `lastIndexOf` to avoid tying execution
	// time to string length when string doesn't end with pattern.
	return d >= 0 && string.indexOf(pattern, d) === d;
}

var cleanup = function(content) {
	var first_pass = content.replace(/[\r\n ]+/gi, ", ");
	if(endsWith(first_pass, ", ")) {
		return first_pass.substr(0, first_pass.length - 2);
	}
	else {
		return first_pass;
	}
};

var cleanup_encode = function(content) {
	return encodeURIComponent(cleanup(content));
};

var transform = function(srcdir, filename, outputdir) {
	var file_content = fs.readFileSync(srcdir + '/' + filename, 'utf8');
	var output = outputdir + "/" + filename.substr(0, filename.length - 4) + "png";
	var command = "curl --globoff -o '"+ output + "'" + ' "http://yuml.me/diagram/scruffy/class/' + cleanup_encode(file_content) + '"';
	exec(command,
	      function (error, stdout, stderr) {
	      	if(error) {
		        console.log('stdout: ' + stdout);
		        console.log('stderr: ' + stderr);	      		
	      	}
	      	else {
	      		console.log("Generated: " + output);
	      	}
	    });
};

var dir = __dirname;
console.log("Scanning " + dir);
fs.readdir(dir, function(err, filenames) {
	filenames.forEach(function(filename) {
		if(endsWith(filename, '.yuml')) {
			transform(dir, filename, '../images');
		}
	});
});
