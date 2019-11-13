"use strict";
exports.__esModule = true;
var src_1 = require("../src");
var chai_1 = require("chai");
describe("attrPath", function () {
    var tester = new src_1.Tester();
    function ok(obj, filter) {
        it("'" + filter + "' in " + JSON.stringify(obj), function () {
            chai_1.assert(tester.test(obj, src_1.parse(filter)));
        });
    }
    describe("eq", function () {
        ok({ a: "a" }, "a eq \"a\"");
        ok({ a: "a" }, "not(a eq \"aa\")");
        ok({ a: 1 }, "a eq 1");
        ok({ h: true }, "h eq true");
    });
    describe("co", function () {
        ok({ a: "abc" }, "a co \"b\"");
        ok({ a: "abc" }, "not(a co \"x\")");
        ok({ a: 3141 }, "a co 1");
        ok({ h: true }, "h co \"ru\"");
    });
    describe("sw", function () {
        ok({ a: "abc" }, "a sw \"a\"");
        ok({ a: "abc" }, "not(a sw \"c\")");
        ok({ a: 3141 }, "a sw 3");
        ok({ h: true }, "h sw \"tr\"");
        ok({ h: null }, "not(h sw \"nu\")");
    });
    describe("ew", function () {
        ok({ a: "abc" }, "a ew \"c\"");
        ok({ a: "abc" }, "not(a ew \"a\")");
        ok({ a: 3141 }, "a ew 1");
        ok({ h: true }, "h ew \"ue\"");
        ok({ h: null }, "not(h ew \"ll\")");
    });
    describe("lt", function () {
        ok({ a: "abc" }, "a lt \"c\"");
        ok({ a: "abc" }, "not(a lt \"a\")");
        ok({ a: 3141 }, "a lt 9999");
        ok({ a: 3 }, "not(a lt 3)");
        ok({ h: false }, "h lt true");
        ok({ h: null }, "not(h lt false)");
    });
    describe("le", function () {
        ok({ a: "abc" }, "a le \"c\"");
        ok({ a: "abc" }, "not(a le \"a\")");
        ok({ a: 3141 }, "a le 9999");
        ok({ a: 3 }, "a le 3");
        ok({ h: false }, "h le true");
    });
    describe("gt", function () {
        ok({ a: "def" }, "a gt \"c\"");
        ok({ a: "def" }, "not(a gt \"e\")");
        ok({ a: 3 }, "not(a gt \"4\")");
        ok({ a: 3123 }, "a gt 3122");
        ok({ a: 3123 }, "not(a gt 3123)");
        ok({ a: false }, "not(a gt true)");
        ok({ a: null }, "not(a gt false)");
    });
    describe("ge", function () {
        ok({ a: "def" }, "a ge \"c\"");
        ok({ a: "def" }, "not(a ge \"e\")");
        ok({ a: 3 }, "not(a ge \"4\")");
        ok({ a: 3123 }, "a ge 3122");
        ok({ a: 3123 }, "a ge 3123");
        ok({ a: false }, "not(a ge true)");
    });
    describe("ignore case (attrPath)", function () {
        ok({ A: 1 }, "A eq 1");
        ok({ A: 1 }, "a eq 1");
        ok({ a: 1 }, "A eq 1");
    });
    describe("pr", function () {
        ok({ a: { b: 10 } }, "a pr");
        ok({ a: { b: 10 } }, "a.b pr");
        ok({ a: { b: 10 } }, "not(a.d pr)");
        ok({ a: { b: 10 } }, "not (a.c pr)");
        ok({ a: { b: 10 } }, "not (c.d pr)");
        ok({ a: { b: 10 } }, "not (c pr)");
    });
    describe("array test is some", function () {
        ok({ a: [{ b: 1 }, { c: 2 }] }, "a.b pr");
        ok({ a: [{ b: 1 }, { c: 2 }] }, "a.c pr");
        ok({ a: [{ b: 1 }, { c: 2 }] }, "not (a.d pr)");
    });
});
//# sourceMappingURL=attrPath.test.js.map