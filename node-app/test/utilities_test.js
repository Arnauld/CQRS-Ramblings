var utilities = require("../lib/utilities");

exports["mixin provides a simple way to declare methods"] = function (test) {
    // defines a basic class with a single method 'value()''
	function Data(value) {}
	Data.prototype.value = function () { 
		return this._value; 
	};

    // defines the methods, one want to plug into our class
	var methods = {
		name : function () {
			return this._name;
		}
	};

    // add new methods & properties
	utilities.mixin(Data.prototype, methods);

	var data = new Data();
	data._name  = "mccallum";
	data._value = 17;
	test.equal(data.value(), 17); // make sure original method is still there
	test.equal(data.name(), "mccallum");
    test.done();
};

exports["mixin provides a simple way to add properties"] = function (test) {
    // defines a basic class with a single method 'value()''
	function Data(value) {}
	Data.prototype.value = function () { 
		return this._value; 
	};

    // defines the properties, one want to plug into our class
	var methods = {
		uuid : "cafebabe-0553-713705"
	};

    // add new methods & properties
	utilities.mixin(Data.prototype, methods);

	var data = new Data();
	data._value = 17;
	test.equal(data.value(), 17); // make sure original method is still there
	test.equal(data.uuid, "cafebabe-0553-713705");
    test.done();
};

exports["trim string"] = function (test) {
	test.equal(utilities.trim(""), "");
	test.equal(utilities.trim(" hello"), "hello");
	test.equal(utilities.trim("hello "), "hello");
	test.equal(utilities.trim(" hello "), "hello");
	test.equal(utilities.trim("   hel  loo   "), "hel  loo");
    test.done();
};

exports["starts with"] = function (test) {
	test.equal(utilities.starts_with("", "What"), false);
	test.equal(utilities.starts_with(" What is this?", "What"), false);
	test.equal(utilities.starts_with("What is this", "What"), true);
	test.equal(utilities.starts_with("Whatever", "What"), true);
    test.done();
};
