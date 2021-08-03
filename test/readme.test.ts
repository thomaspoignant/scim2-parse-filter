import { assert } from "chai";
import { Filter, filter, parse, stringify } from "../src";

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
});
