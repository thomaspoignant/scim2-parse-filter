import { Filter } from ".";

export function stringify(f: Filter, trimParens = true): string {
  let returnValue = '';
  switch (f.op) {
    case "eq":
    case "ne":
    case "co":
    case "sw":
    case "ew":
    case "gt":
    case "lt":
    case "ge":
    case "le":
      returnValue = `${f.attrPath} ${f.op} ${JSON.stringify(f.compValue)}`;
      break;
    case "pr":
      returnValue = `${f.attrPath} ${f.op}`;
      break;
    case "or":
      const filtersAsString = f.filters.map(filter => stringify(filter)).join(` ${f.op} `);
      returnValue = `(${filtersAsString})`;
      break;
    case "and":
      returnValue = f.filters.map(filter => stringify(filter, false)).join(` ${f.op} `);
      return returnValue;
    case "not":
      returnValue = `${f.op} (${stringify(f.filter)})`;
      break;
    case "[]":
      returnValue = `${f.attrPath}[${stringify(f.valFilter)}]`;
      break;
  }
  if (trimParens) {
    returnValue = returnValue.replace(/(^\()(.*)(\)$)/, '$2');
  }
  return returnValue;
}
