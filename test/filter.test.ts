import { assert } from "chai";
import { filter, parse } from "../src";

describe("filter", () => {
    it("end to end or condition", () => {
        const f = filter(parse(`userName eq "test1@example.com" or userName eq "test2@example.com"`));
        const users = [
            { userName: "test1@example.com" },
            { userName: "test2@example.com" }
        ];
        const ret = users.filter(f);
        assert.deepEqual(ret, users);
    });
    it("end to end and condition", () => {
        const f = filter(parse(`userName eq "test1@example.com" and id eq "id_1"`));
        const users = [
            { userName: "test1@example.com", id: "id_1" },
            { userName: "test2@example.com", id: "id_2" }
        ];
        const ret = users.filter(f);
        assert.deepEqual(ret, [users[0]]);
    });
});
