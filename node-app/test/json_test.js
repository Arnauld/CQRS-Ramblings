
exports["JSON can be parsed from simple string"] = function (test) {
	var json_string = '{ "name" : "mccallum" }';
	var data = JSON.parse(json_string);

	test.equal(data.name, "mccallum");
    test.done();
};

exports["JSON can be parsed from simple string with key and value escaped using the \\\" sequence"] = function (test) {
	var json_string = "{ \"name\" : \"mccallum\" }";
	var data = JSON.parse(json_string);

	test.equal(data.name, "mccallum");
    test.done();
};

exports["JSON issue: key must be quoted"] = function (test) {
	test.throws(function () {
		JSON.parse('{ name : "mccallum" }');
	});
	test.done();
};

exports["JSON issue: key cannot be quoted by single quote"] = function (test) {
	test.throws(function () {
		JSON.parse("{ 'name' : \"mccallum\" }");
	});
	test.done();
};

exports["JSON issue: value cannot be quoted by single quote"] = function (test) {
	test.throws(function () {
		JSON.parse("{ \"name\" : 'mccallum' }");
	});
	test.done();
};
