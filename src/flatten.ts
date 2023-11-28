import { Filter } from "./index";

export const valfilter = (f: Filter, path?: string): Filter => {
  if (path && "attrPath" in f) {
    f = { ...f, attrPath: `${path}.${f.attrPath}` };
  }
  switch (f.op) {
    case "and":
    case "or":
      return { ...f, filters: f.filters.map(c => valfilter(c, path)) };
    case "not":
      return { ...f, filter: valfilter(f, path) };
    case "[]":
      return valfilter(f.valFilter, f.attrPath);
  }
  return f;
};
// 1 and 2 or (1 or b) => 1 and 2 or 1 or b
export const log = (f: Filter): Filter => {
  switch (f.op) {
    case "and":
    case "or":
      const filters = f.filters.map(log);
      const result: Filter[] = [];
      filters.forEach(c => {
        if (c.op == f.op) {
          c.filters.forEach(cc => result.push(cc));
        } else {
          result.push(c);
        }
      });
      return { ...f, filters: result };
  }
  return f;
};
