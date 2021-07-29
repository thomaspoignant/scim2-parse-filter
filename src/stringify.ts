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
      returnValue = `${f.attrPath} ${f.op} "${f.compValue}"`;
      break;
    case "pr":
      returnValue = `${f.attrPath} ${f.op}`;
      break;
    case "or":
    case "and":
      returnValue = `(${stringify(f.filters[0], false)} ${f.op} ${stringify(f.filters[1], false)})`;
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
