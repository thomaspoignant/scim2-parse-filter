"use strict";
exports.__esModule = true;
var test_util_1 = require("./test_util");
var src_1 = require("../src");
var chai_1 = require("chai");
var test = function (text, e) {
    it(text, function () {
        chai_1.assert.deepEqual(src_1.parse(text), e);
    });
};
describe('parse', function () {
    describe("logic", function () {
        function to_s(f) {
            switch (f.op) {
                case "eq":
                    return f.attrPath + "-" + f.op + "-" + f.compValue;
                case "or":
                case "and":
                    return f.op + "(" + f.filters.map(to_s).join(" ") + ")";
                default:
                    return f;
            }
        }
        function teq(e, a) {
            chai_1.assert.deepEqual(to_s(a), to_s(src_1.parse(e)), e);
        }
        var _a = [test_util_1.eq("n1", 1), "n1 eq 1"], a1 = _a[0], e1 = _a[1];
        var _b = [test_util_1.eq("n2", 2), "n2 eq 2"], a2 = _b[0], e2 = _b[1];
        var _c = [test_util_1.eq("n3", 3), "n3 eq 3"], a3 = _c[0], e3 = _c[1];
        var _d = [test_util_1.eq("n4", 4), "n4 eq 4"], a4 = _d[0], e4 = _d[1];
        it("symple", function () {
            teq("" + e1, a1);
        });
        it("and", function () {
            teq(e1 + " and " + e2, test_util_1.and(a1, a2));
        });
        it("and and", function () {
            teq(e1 + " and " + e2 + " and " + e3, test_util_1.and(a1, a2, a3));
        });
        it("and or", function () {
            teq(e1 + " and " + e2 + " or " + e3, test_util_1.or(test_util_1.and(a1, a2), a3));
        });
        it("or and", function () {
            teq(e1 + " or " + e2 + " and " + e3, test_util_1.or(a1, test_util_1.and(a2, a3)));
        });
        it("or or", function () {
            teq(e1 + " or " + e2 + " or " + e3, test_util_1.or(a1, a2, a3));
        });
        it("and and and", function () {
            teq(e1 + " and " + e2 + " and " + e3 + " and " + e4, test_util_1.and(a1, a2, a3, a4));
        });
        it("and and or", function () {
            teq(e1 + " and " + e2 + " and " + e3 + " or " + e4, test_util_1.or(test_util_1.and(a1, a2, a3), a4));
        });
        it("and or and", function () {
            teq(e1 + " and " + e2 + " or " + e3 + " and " + e4, test_util_1.or(test_util_1.and(a1, a2), test_util_1.and(a3, a4)));
        });
        it("and or or", function () {
            teq(e1 + " and " + e2 + " or " + e3 + " or " + e4, test_util_1.or(test_util_1.and(a1, a2), a3, a4));
        });
        it("or and and", function () {
            teq(e1 + " or " + e2 + " and " + e3 + " and " + e4, test_util_1.or(a1, test_util_1.and(a2, a3, a4)));
        });
        it("or and or", function () {
            teq(e1 + " or " + e2 + " and " + e3 + " or " + e4, test_util_1.or(a1, test_util_1.and(a2, a3), a4));
        });
        it("or and or and or and or", function () {
            teq(e1 + " or " + e2 + " and " + e3 + " or " + e4 + " and " + e1 + " or " + e2 + " and " + e3 + " or " + e4, test_util_1.or(a1, test_util_1.and(a2, a3), test_util_1.and(a4, a1), test_util_1.and(a2, a3), a4));
        });
        it("and or and or and or and", function () {
            teq(e2 + " and " + e3 + " or " + e4 + " and " + e1 + " or " + e2 + " and " + e3 + " or " + e4 + " and " + e1, test_util_1.or(test_util_1.and(a2, a3), test_util_1.and(a4, a1), test_util_1.and(a2, a3), test_util_1.and(a4, a1)));
        });
    });
    describe('operator ignore case', function () {
        test("hoge Eq \"hoge\"", test_util_1.eq("hoge", "hoge"));
    });
    describe("samples", function () {
        test('userName eq "bjensen"', test_util_1.eq("userName", "bjensen"));
        test("name.familyName co \"O'Malley\"", test_util_1.op("co", "name.familyName", "O'Malley"));
        test("userName sw \"J\"", test_util_1.op("sw", "userName", "J"));
        test("urn:ietf:params:scim:schemas:core:2.0:User:userName sw \"J\"", test_util_1.op("sw", "urn:ietf:params:scim:schemas:core:2.0:User:userName", "J"));
        test("title pr", test_util_1.pr("title"));
        test("meta.lastModified gt \"2011-05-13T04:42:34Z\"", test_util_1.op("gt", "meta.lastModified", "2011-05-13T04:42:34Z"));
        test("meta.lastModified ge \"2011-05-13T04:42:34Z\"", test_util_1.op("ge", "meta.lastModified", "2011-05-13T04:42:34Z"));
        test("meta.lastModified lt \"2011-05-13T04:42:34Z\"", test_util_1.op("lt", "meta.lastModified", "2011-05-13T04:42:34Z"));
        test("meta.lastModified le \"2011-05-13T04:42:34Z\"", test_util_1.op("le", "meta.lastModified", "2011-05-13T04:42:34Z"));
        test("title pr and userType eq \"Employee\"", test_util_1.and(test_util_1.pr("title"), test_util_1.eq("userType", "Employee")));
        test("title pr or userType eq \"Intern\"", test_util_1.or(test_util_1.pr("title"), test_util_1.eq("userType", "Intern")));
        test("schemas eq \"urn:ietf:params:scim:schemas:extension:enterprise:2.0:User\"", test_util_1.eq("schemas", "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"));
        test("userType eq \"Employee\" and (emails co \"example.com\" or emails co \"example.org\")", test_util_1.and(test_util_1.eq("userType", "Employee"), test_util_1.or(test_util_1.op("co", "emails", "example.com"), test_util_1.op("co", "emails", "example.org"))));
        test("userType ne \"Employee\" and not (emails co \"example.com\" or emails co \"example.org\")", test_util_1.and(test_util_1.op("ne", "userType", "Employee"), {
            op: "not",
            filter: test_util_1.or(test_util_1.op("co", "emails", "example.com"), test_util_1.op("co", "emails", "example.org"))
        }));
        test("userType eq \"Employee\" and (emails.type eq \"work\")", test_util_1.and(test_util_1.eq("userType", "Employee"), test_util_1.eq("emails.type", "work")));
        test("userType eq \"Employee\" and emails[type eq \"work\" and value co \"@example.com\"]", test_util_1.and(test_util_1.eq("userType", "Employee"), test_util_1.v("emails", test_util_1.and(test_util_1.eq("type", "work"), test_util_1.op("co", "value", "@example.com")))));
        test("emails[type eq \"work\" and value co \"@example.com\"] or ims[type eq \"xmpp\" and value co \"@foo.com\"]", test_util_1.or(test_util_1.v("emails", test_util_1.and(test_util_1.eq("type", "work"), test_util_1.op("co", "value", "@example.com"))), test_util_1.v("ims", test_util_1.and(test_util_1.eq("type", "xmpp"), test_util_1.op("co", "value", "@foo.com")))));
        test("emails[value[hoge eq \"@example.com\"] and value[hoge eq \"@example.com\"]] or name eq \"xxx\"", test_util_1.or(test_util_1.v("emails", test_util_1.and(test_util_1.v("value", test_util_1.eq("hoge", "@example.com")), test_util_1.v("value", test_util_1.eq("hoge", "@example.com")))), test_util_1.eq("name", "xxx")));
    });
});
//# sourceMappingURL=parse.test.js.map