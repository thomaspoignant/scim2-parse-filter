"use strict";
exports.__esModule = true;
var test_util_1 = require("./test_util");
var src_1 = require("../src");
var chai_1 = require("chai");
function to_s(f) {
    switch (f.op) {
        case "or":
        case "and":
            return f.op + "(" + f.filters.map(to_s).join(" ") + ")";
        case "eq":
            return f.attrPath + "=" + f.compValue;
        default:
            return JSON.stringify(f);
    }
}
var test = function (text, e) {
    it(text, function () {
        chai_1.assert.equal(to_s(src_1.flatten(src_1.parse(text))), to_s(e));
    });
};
var make = function (num) { return [
    test_util_1.eq("n" + num, num),
    "n" + num + " eq " + num
]; };
var _a = make(1), a1 = _a[0], e1 = _a[1];
var _b = make(2), a2 = _b[0], e2 = _b[1];
var _c = make(3), a3 = _c[0], e3 = _c[1];
var _d = make(4), a4 = _d[0], e4 = _d[1];
describe("flatten", function () {
    describe("simple", function () {
        test("(" + e1 + " and " + e2 + ") and " + e3, test_util_1.and(a1, a2, a3));
        test("(" + e1 + " and (" + e2 + " and " + e4 + ")) and " + e3, test_util_1.and(a1, a2, a4, a3));
        test("(" + e1 + " and ((" + e2 + " and " + e4 + "))) and " + e3, test_util_1.and(a1, a2, a4, a3));
        test("xx[" + e1 + " and ((" + e2 + " and " + e4 + "))]", test_util_1.and(test_util_1.eq("xx.n1", 1), test_util_1.eq("xx.n2", 2), test_util_1.eq("xx.n4", 4)));
    });
    describe("andor", function () {
        test("(" + e1 + " or " + e2 + ") and " + e3, test_util_1.and(test_util_1.or(a1, a2), a3));
        test(e1 + " or (" + e2 + " and " + e3 + ")", test_util_1.or(a1, test_util_1.and(a2, a3)));
        test("(" + e1 + ") or (" + e2 + " and " + e3 + ")", test_util_1.or(a1, test_util_1.and(a2, a3)));
    });
});
//# sourceMappingURL=flatten.test.js.map