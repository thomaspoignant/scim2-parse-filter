import { Filter } from "./index";

export function stringify(f: Filter, wrapOr = false): string {
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
      returnValue = wrapOr ? `(${filtersAsString})` : filtersAsString;
      break;
    case "and":
      returnValue = f.filters.map(filter => stringify(filter, true)).join(` ${f.op} `);
      break;
    case "not":
      returnValue = `${f.op} (${stringify(f.filter)})`;
      break;
    case "[]":
      returnValue = `${f.attrPath}[${stringify(f.valFilter)}]`;
      break;
  }

  return returnValue;
}
