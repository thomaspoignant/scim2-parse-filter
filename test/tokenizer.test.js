"use strict";
exports.__esModule = true;
require("mocha");
var parser_1 = require("../src/parser");
var test_util_1 = require("./test_util");
var chai = require("chai");
var assert = chai.assert;
describe("tokenizer", function () {
    var tok = function (literal, type) { return ({ literal: literal, type: type }); };
    it("eot", function () {
        assert.deepEqual(parser_1.tokenizer(""), [test_util_1.EOT]);
    });
    it("false", function () {
        assert.deepEqual(parser_1.tokenizer("false"), [
            { literal: "false", type: "Word" },
            test_util_1.EOT
        ]);
    });
    it("userName is AttrPath", function () {
        assert.deepEqual(parser_1.tokenizer("userName"), [
            { literal: "userName", type: "Word" },
            test_util_1.EOT
        ]);
    });
    it("userName eq -12", function () {
        assert.deepEqual([tok("userName", "Word"), tok("eq", "Word"), tok("-12", "Number"), test_util_1.EOT], parser_1.tokenizer("userName eq -12"));
    });
});
//# sourceMappingURL=tokenizer.test.js.map