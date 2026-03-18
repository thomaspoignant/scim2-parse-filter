import { assert } from "chai";
import { filter, parse, FilterOptions } from "../src";

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
    it("end to end shielding backslash in quotes", () => {
        const f = filter(parse(`userName eq "domain\\user.name"`));
        const users = [
            { userName: "domain\\user.name" }
        ];
        const ret = users.filter(f);
        assert.deepEqual(ret, users);
    });
});

describe("filter — case-insensitive comparisons (RFC 7643 §2.7)", () => {
    it("eq matches regardless of case by default", () => {
        const f = filter(parse(`userName eq "JohnDoe"`));
        assert.isTrue(f({ userName: "johndoe" }));
        assert.isTrue(f({ userName: "JOHNDOE" }));
        assert.isTrue(f({ userName: "JohnDoe" }));
    });

    it("ne is case-insensitive by default", () => {
        const f = filter(parse(`userName ne "JohnDoe"`));
        assert.isFalse(f({ userName: "johndoe" }));
        assert.isFalse(f({ userName: "JOHNDOE" }));
        assert.isTrue(f({ userName: "JaneDoe" }));
    });

    it("co is case-insensitive by default", () => {
        const f = filter(parse(`userName co "JOHN"`));
        assert.isTrue(f({ userName: "john.doe" }));
        assert.isTrue(f({ userName: "John.Doe" }));
        assert.isFalse(f({ userName: "jane.doe" }));
    });

    it("sw is case-insensitive by default", () => {
        const f = filter(parse(`userName sw "JOHN"`));
        assert.isTrue(f({ userName: "john.doe" }));
        assert.isTrue(f({ userName: "John.Doe" }));
        assert.isFalse(f({ userName: "doe.john" }));
    });

    it("ew is case-insensitive by default", () => {
        const f = filter(parse(`userName ew "DOE"`));
        assert.isTrue(f({ userName: "john.doe" }));
        assert.isTrue(f({ userName: "John.Doe" }));
        assert.isFalse(f({ userName: "doe.john" }));
    });

    it("non-string values are unaffected by case normalization", () => {
        const fEq = filter(parse(`score eq 42`));
        assert.isTrue(fEq({ score: 42 }));
        assert.isFalse(fEq({ score: 43 }));

        const fBool = filter(parse(`active eq true`));
        assert.isTrue(fBool({ active: true }));
        assert.isFalse(fBool({ active: false }));
    });

    it("caseExact: true restores case-sensitive behavior globally", () => {
        const opts: FilterOptions = { caseExact: true };
        const f = filter(parse(`userName eq "JohnDoe"`), opts);
        assert.isTrue(f({ userName: "JohnDoe" }));
        assert.isFalse(f({ userName: "johndoe" }));
        assert.isFalse(f({ userName: "JOHNDOE" }));
    });

    it("CaseExactResolver provides per-attribute control", () => {
        const opts: FilterOptions = {
            caseExact: (attr: string) => attr === "externalId"
        };
        const fUser = filter(parse(`userName eq "JohnDoe"`), opts);
        assert.isTrue(fUser({ userName: "johndoe" }));   // case-insensitive

        const fExt = filter(parse(`externalId eq "ABC123"`), opts);
        assert.isTrue(fExt({ externalId: "ABC123" }));   // case-sensitive: exact match
        assert.isFalse(fExt({ externalId: "abc123" }));  // case-sensitive: no match
    });

    it("Microsoft Entra ID use case — username differs only in case", () => {
        const f = filter(parse(`userName eq "user@contoso.com"`));
        const users = [
            { userName: "User@Contoso.COM" },
            { userName: "user@contoso.com" },
            { userName: "other@contoso.com" },
        ];
        const ret = users.filter(f);
        assert.deepEqual(ret, [users[0], users[1]]);
    });
});
