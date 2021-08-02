import { Filter } from ".";

export function stringify(f: Filter, trimParens = true): string {
  let returnValue = '';
  switch(f.op) {
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
    case "and":
      const filtersAsString = f.filters.map(filter => stringify(filter, false)).join(` ${f.op} `);
      returnValue = `(${filtersAsString})`;
      break;
    case "not":
      returnValue = `${f.op} (${stringify(f.filter, true)})`;
      break;
    case "[]":
      returnValue = `${f.attrPath}[${stringify(f.valFilter)}]`;
      break;
  }
  if (trimParens) {
    returnValue = returnValue.replace(/^\(/, '').replace(/\)$/, '');
  }
  return returnValue;
}
