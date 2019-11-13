"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var src_1 = require("../src");
describe("filter", function () {
    it("end to end or condition", function () {
        var f = src_1.filter(src_1.parse("userName eq \"test1@example.com\" or userName eq \"test2@example.com\""));
        var users = [
            { userName: "test1@example.com" },
            { userName: "test2@example.com" }
        ];
        var ret = users.filter(f);
        chai_1.assert.deepEqual(ret, users);
    });
    it("end to end and condition", function () {
        var f = src_1.filter(src_1.parse("userName eq \"test1@example.com\" and id eq \"id_1\""));
        var users = [
            { userName: "test1@example.com", id: "id_1" },
            { userName: "test2@example.com", id: "id_2" }
        ];
        var ret = users.filter(f);
        chai_1.assert.deepEqual(ret, [users[0]]);
    });
});
//# sourceMappingURL=filter.test.js.map