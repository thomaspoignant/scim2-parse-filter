"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var src_1 = require("../src");
describe("readme", function () {
    it("usage", function () {
        var f = src_1.filter(src_1.parse("userName eq \"test1@example.com\""));
        var users = [
            { userName: "test1@example.com" },
            { userName: "test2@example.com" }
        ];
        var ret = users.filter(f);
        chai_1.assert.deepEqual(ret, [users[0]]);
    });
    it("You can parse filter query and get ast.", function () {
        var f = src_1.parse("userType eq \"Employee\" and emails[type eq \"work\" and value co \"@example.com\"]");
        chai_1.assert.deepEqual(f, {
            op: "and",
            filters: [
                {
                    op: "eq",
                    attrPath: "userType",
                    compValue: "Employee"
                },
                {
                    op: "[]",
                    attrPath: "emails",
                    valFilter: {
                        op: "and",
                        filters: [
                            {
                                op: "eq",
                                attrPath: "type",
                                compValue: "work"
                            },
                            {
                                op: "co",
                                attrPath: "value",
                                compValue: "@example.com"
                            }
                        ]
                    }
                }
            ]
        });
    });
});
//# sourceMappingURL=readme.test.js.map