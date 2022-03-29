scim2-parse-filter
============
[![npm version](http://img.shields.io/npm/v/scim2-parse-filter.svg?style=flat&color=blue)](https://npmjs.org/package/scim2-parse-filter "View this project on npm")
[![Build Status](https://travis-ci.com/thomaspoignant/scim2-parse-filter.svg?branch=master)](https://travis-ci.com/thomaspoignant/scim2-parse-filter)
[![Downloads](https://img.shields.io/npm/dt/scim2-parse-filter.svg?style=flat&color=blue)](https://npmjs.com/package/scim2-parse-filter)

RFC7643 SCIM(System for Cross-domain Identity Management) 2.0 filter parser.
see [section 3.4.2.2. Filtering](https://tools.ietf.org/html/rfc7644#section-3.4.2.2).

This implements filter syntax parser and json filter function.

This is a fork https://www.npmjs.com/package/scim2-filter version 0.2.0 with bug correction.

usage
-----
### parse
You can parse filter query and get ast.
```javascript
import {parse} from 'scim2-parse-filter';

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
```

### filter
and You can use filter in json.

```javascript
import {parse, filter} from 'scim2-parse-filter';

const f = filter(parse(`userName eq "test1@example.com"`));
const users = [
  { userName: "test1@example.com" },
  { userName: "test2@example.com" }
];
const ret = users.filter(f);
assert.deepEqual(ret, [users[0]]);
```

### stringify
and you can convert an AST back into a SCIM query.

```typescript
import { Filter, stringify } from 'scim2-parse-filter';

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
```
