import { assert } from "chai";
import { Filter, filter, parse, stringify, expand, flatten } from "../src";

describe("readme", () => {
  it("filter", () => {
    const f = filter(parse(`userName eq "test1@example.com"`));
    const users = [
      { userName: "test1@example.com" },
      { userName: "test2@example.com" }
    ];
    const ret = users.filter(f);
    assert.deepEqual(ret, [users[0]]);
  });
  it("parse", () => {
    const f = parse(`userType eq "Employee" and emails[type eq "work" and value co "@example.com"]`);
    assert.deepEqual(f, {
      op:"and",
      filters:[
        {
          op:"eq",
          attrPath:"userType",
          compValue:"Employee"
        },
        {
          op:"[]",
          attrPath:"emails",
          valFilter:{
            op:"and",
            filters:[
              {
                op:"eq",
                attrPath:"type",
                compValue:"work"
              },
              {
                op:"co",
                attrPath:"value",
                compValue:"@example.com"
              }
            ]
          }
        }
      ]
    });
  });
  it('stringify', () => {
    const ast: Filter = {
      op:"and",
      filters:[
        {
          op:"eq",
          attrPath:"userType",
          compValue:"Employee"
        },
        {
          op:"[]",
          attrPath:"emails",
          valFilter:{
            op:"and",
            filters:[
              {
                op:"eq",
                attrPath:"type",
                compValue:"work"
              },
              {
                op:"co",
                attrPath:"value",
                compValue:"@example.com"
              }
            ]
          }
        }
      ]
    };

    assert.deepEqual(stringify(ast), 'userType eq "Employee" and emails[type eq "work" and value co "@example.com"]');
  });
  it("expand", () => {
    const f = parse(
      `userType eq "Employee" and emails[type eq "work" or value co "@example.com"]`
    );

    assert.deepEqual(expand(f), {
      op: "or",
      filters: [
        {
          op: "and",
          filters: [
            {
              op: "eq",
              attrPath: "userType",
              compValue: "Employee",
            },
            {
              op: "eq",
              attrPath: "emails.type",
              compValue: "work",
            },
          ],
        },
        {
          op: "and",
          filters: [
            {
              op: "eq",
              attrPath: "userType",
              compValue: "Employee",
            },
            {
              op: "co",
              attrPath: "emails.value",
              compValue: "@example.com",
            },
          ],
        },
      ],
    });
  });
  it("flatten", () => {
    const f = parse(
      `userType eq "Employee" and (userName eq "bob" and email ew "@example.com")`
    );

    assert.deepEqual(flatten(f), {
      op: "and",
      filters: [
        {
          op: "eq",
          attrPath: "userType",
          compValue: "Employee",
        },
        {
          op: "eq",
          attrPath: "userName",
          compValue: "bob",
        },
        {
          op: "ew",
          attrPath: "email",
          compValue: "@example.com",
        },
      ],
    });
  });
});
