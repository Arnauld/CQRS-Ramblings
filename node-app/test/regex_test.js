
var UUID_PATTERN = /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{8}/;

exports["'test': a part of the text match the regex"] = function (test) {
	test.equal(UUID_PATTERN.test("abcdef01-1234-1234-1234-abcdef01"), true);
	test.equal(UUID_PATTERN.test("abcdef01-1234-1234-1234-abcdef01 Eh oh"), true);
	test.equal(UUID_PATTERN.test("Eh oh! abcdef01-1234-1234-1234-abcdef01 Eh oh"), true);
	test.equal(UUID_PATTERN.test("Eh oh! abcdef01-1234-1234-1234-abcdef01"), true);
	test.equal(UUID_PATTERN.test("abcdef01-gggg-1234-1234-abcdef01"), false);
    test.done();
};
