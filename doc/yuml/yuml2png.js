var fs     = require('fs'),
    exec   = require('child_process').exec,
    crypto = require('crypto'),
    path   = require('path')
    ;

 var options = (function() {
	var value = {
		verbose:false,
		scaling:100
	};
	 var i;
	 for(i = 2; i < process.argv.length; i++) {
	 	var opt = process.argv[i];
	 	if(opt === "-v") {
	 		value.verbose = true;
	 	}
	 	if(opt === "-scale") {
	 		value.scaling = process.argv[++i];
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
	var output_suffix = "-yuml.png";
	var scaling_opt = "";
	if(options.scaling != 100) {
		scaling_opt = ";scale:" + options.scaling;
		output_suffix = "-" + options.scaling + "%" + output_suffix;
	}
	var raw_content = fs.readFileSync(srcdir + '/' + filename, 'utf8');
	var cleaned_content = cleanup_encode(raw_content);
	var output = outputdir + "/" + filename.substr(0, filename.length - 5) + output_suffix;

	/**
	 * Check MD5 in order to do not regenerate existing image
	 */
	var md5sum = crypto.createHash('md5');
	md5sum.update(cleaned_content);
	var actual_md5 = md5sum.digest('hex');

	var output_md5 = output + ".md5";
	if(path.existsSync(output) && path.existsSync(output_md5)) {
		var previous_md5 = fs.readFileSync(output_md5, 'utf8');
		if(actual_md5 == previous_md5) {
			console.log("Already generated with same content, skipping " + filename);
			return;
		}
	}
	fs.writeFileSync(output_md5, actual_md5);
  	console.log('MD5 generated and saved at ' + output_md5);

	// 
	var command = "curl --globoff -o '"+ output + "'" + ' "http://yuml.me/diagram/scruffy' + scaling_opt + '/class/' + cleaned_content + '"';
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
