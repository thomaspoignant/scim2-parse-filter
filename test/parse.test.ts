import { eq, op, pr, and, or, v } from "./test_util";
import { Filter, parse } from "../src";
import { assert } from "chai";

const test = (text: string, e: Filter) => {
  it(text, () => {
    assert.deepEqual(parse(text), e);
  });
};
describe('parse', () =>{
  describe("logic", () => {
    function to_s(f: Filter): any {
      switch (f.op) {
        case "eq":
          return `${f.attrPath}-${f.op}-${f.compValue}`;
        case "or":
        case "and":
          return `${f.op}(${f.filters.map(to_s).join(" ")})`;
        default:
          return f;
      }
    }
    function teq(e: string, a: Filter) {
      assert.deepEqual(to_s(a), to_s(parse(e)), e);
    }
    const [a1, e1]: [Filter, string] = [eq("n1", 1), "n1 eq 1"];
    const [a2, e2]: [Filter, string] = [eq("n2", 2), "n2 eq 2"];
    const [a3, e3]: [Filter, string] = [eq("n3", 3), "n3 eq 3"];
    const [a4, e4]: [Filter, string] = [eq("n4", 4), "n4 eq 4"];
    it("symple", () => {
      teq(`${e1}`, a1);
    });
    it("and", () => {
      teq(`${e1} and ${e2}`, and(a1, a2));
    });

    it("and and", () => {
      teq(`${e1} and ${e2} and ${e3}`, and(a1, a2, a3));
    });
    it("and or", () => {
      teq(`${e1} and ${e2} or ${e3}`, or(and(a1, a2), a3));
    });
    it("or and", () => {
      teq(`${e1} or ${e2} and ${e3}`, or(a1, and(a2, a3)));
    });
    it("or or", () => {
      teq(`${e1} or ${e2} or ${e3}`, or(a1, a2, a3));
    });

    it("and and and", () => {
      teq(`${e1} and ${e2} and ${e3} and ${e4}`, and(a1, a2, a3, a4));
    });
    it("and and or", () => {
      teq(`${e1} and ${e2} and ${e3} or ${e4}`, or(and(a1, a2, a3), a4));
    });
    it("and or and", () => {
      teq(`${e1} and ${e2} or ${e3} and ${e4}`, or(and(a1, a2), and(a3, a4)));
    });
    it("and or or", () => {
      teq(`${e1} and ${e2} or ${e3} or ${e4}`, or(and(a1, a2), a3, a4));
    });
    it("or and and", () => {
      teq(`${e1} or ${e2} and ${e3} and ${e4}`, or(a1, and(a2, a3, a4)));
    });
    it("or and or", () => {
      teq(`${e1} or ${e2} and ${e3} or ${e4}`, or(a1, and(a2, a3), a4));
    });
    it("or and or and or and or", () => {
      teq(
        `${e1} or ${e2} and ${e3} or ${e4} and ${e1} or ${e2} and ${e3} or ${e4}`,
        or(a1, and(a2, a3), and(a4, a1), and(a2, a3), a4)
      );
    });
    it("and or and or and or and", () => {
      teq(
        `${e2} and ${e3} or ${e4} and ${e1} or ${e2} and ${e3} or ${e4} and ${e1}`,
        or(and(a2, a3), and(a4, a1), and(a2, a3), and(a4, a1))
      );
    });
  });
  describe('operator ignore case', () => {
    test(`hoge Eq "hoge"`, eq("hoge", "hoge"));
  });

  describe("samples", () => {
    test('userName eq "bjensen"', eq("userName", "bjensen"));
    test(
      `name.familyName co "O'Malley"`,
      op("co", "name.familyName", "O'Malley")
    );
    test(`userName sw "J"`, op("sw", "userName", "J"));
    test(
      `urn:ietf:params:scim:schemas:core:2.0:User:userName sw "J"`,
      op("sw", "urn:ietf:params:scim:schemas:core:2.0:User:userName", "J")
    );
    test(`title pr`, pr("title"));
    test(
      `meta.lastModified gt "2011-05-13T04:42:34Z"`,
      op("gt", "meta.lastModified", "2011-05-13T04:42:34Z")
    );
    test(
      `meta.lastModified ge "2011-05-13T04:42:34Z"`,
      op("ge", "meta.lastModified", "2011-05-13T04:42:34Z")
    );
    test(
      `meta.lastModified lt "2011-05-13T04:42:34Z"`,
      op("lt", "meta.lastModified", "2011-05-13T04:42:34Z")
    );
    test(
      `meta.lastModified le "2011-05-13T04:42:34Z"`,
      op("le", "meta.lastModified", "2011-05-13T04:42:34Z")
    );
    test(
      `title pr and userType eq "Employee"`,
      and(pr("title"), eq("userType", "Employee"))
    );
    test(
      `title pr or userType eq "Intern"`,
      or(pr("title"), eq("userType", "Intern"))
    );
    test(
      `schemas eq "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"`,
      eq(
        "schemas",
        "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"
      )
    );
    test(
      `userType eq "Employee" and (emails co "example.com" or emails co "example.org")`,
      and(
        eq("userType", "Employee"),
        or(op("co", "emails", "example.com"), op("co", "emails", "example.org"))
      )
    );
    test(
      `userType ne "Employee" and not (emails co "example.com" or emails co "example.org")`,
      and(op("ne", "userType", "Employee"), {
        op: "not",
        filter: or(
          op("co", "emails", "example.com"),
          op("co", "emails", "example.org")
        )
      })
    );
    test(
      `userType eq "Employee" and (emails.type eq "work")`,
      and(eq("userType", "Employee"), eq("emails.type", "work"))
    );
    test(
      `userType eq "Employee" and emails[type eq "work" and value co "@example.com"]`,
      and(eq("userType", "Employee"), v("emails", and(eq("type", "work"), op("co", "value", "@example.com"))))
    );
    test(
      `emails[type eq "work" and value co "@example.com"] or ims[type eq "xmpp" and value co "@foo.com"]`,
      or(
        v("emails", and(eq("type", "work"), op("co", "value", "@example.com"))),
        v("ims", and(eq("type", "xmpp"), op("co", "value", "@foo.com")))
      )
    );
    test(
      `emails[value[hoge eq "@example.com"] and value[hoge eq "@example.com"]] or name eq "xxx"`,
      or(
        v("emails", and(v("value", eq("hoge", "@example.com")), v("value", eq("hoge", "@example.com")))),
        eq("name", "xxx"))
    );
  });
});
