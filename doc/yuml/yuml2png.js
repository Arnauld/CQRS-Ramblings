var fs   = require('fs'),
    exec = require('child_process').exec
    ;

 var options = (function() {
	 var value = {verbose:false};
	 var i;
	 for(i = 2; i < process.argv.length; i++) {
	 	var opt = process.argv[i];
	 	if(opt === "-v") {
	 		value.verbose = true;
	 	}
	 }
	 return value;
})();

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
	var encoded = encodeURIComponent(cleanup(content));
	encoded = encoded.replace(/\%3B/g, ";");
	return encoded;
};

var transform = function(srcdir, filename, outputdir) {
	var file_content = fs.readFileSync(srcdir + '/' + filename, 'utf8');
	var output = outputdir + "/" + filename.substr(0, filename.length - 5) + "-yuml.png";
	var command = "curl --globoff -o '"+ output + "'" + ' "http://yuml.me/diagram/scruffy/class/' + cleanup_encode(file_content) + '"';
	if(options.verbose) {
		console.log(command);	
	}
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
