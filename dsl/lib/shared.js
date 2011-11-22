exports.split_words = function(data) {
	var regex = new RegExp("[ \\-_]+", "g");
	return data.split(regex);
};

exports.past_tense = function(verb) {
	var lowered = verb.toLowerCase();
	if(lowered.endsWith("y"))
		return verb.substring(0,verb.length-1) + "ied";
	else if(lowered.endsWith("e"))
		return verb + "d";
	else
		return verb + "ed";	
};

exports.toLowerCase = function(data) { return data.toLowerCase(); }
