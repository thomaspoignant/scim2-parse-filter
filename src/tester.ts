import { Filter, Compare } from "./index";

type CompValue = Compare["compValue"];

export class Tester {
  constructor() {}
  static readonly UNDEF = Symbol("undefined");
  test(r: any, f: Filter): boolean {
    switch (f.op) {
      case "or":
        return f.filters.some(c => this.test(r, c));
      case "and":
        return f.filters.every(c => this.test(r, c));
      case "not":
        return !this.test(r, f.filter);
      case "[]":
        return this.attrTest(this.attrPath(f.attrPath), r, s =>
          this.test(s, f.valFilter)
        );
      case "pr":
        return this.attrTest(this.attrPath(f.attrPath), r, s => this[f.op](s));
      case "eq":
      case "ne":
      case "co":
      case "sw":
      case "ew":
      case "gt":
      case "lt":
      case "ge":
      case "le":
        return this.attrTest(this.attrPath(f.attrPath), r, s =>
          this[f.op](s, f.compValue)
        );
    }
  }
  attrPath(path: string): string[] {
    const i = path.lastIndexOf(":");
    if (i === -1) {
      return path.split(".");
    }
    return [path.substring(0, i), ...path.substring(i + 1).split(".")];
  }
  attrTest(path: string[], r: any, op: (r: any) => boolean): boolean {
    if (path.length === 0) {
      return op(r);
    }
    if (typeof r !== "object" || r === null) {
      return false;
    }
    if (Array.isArray(r)) {
      return r.some(i => this.attrTest(path, i, op));
    }
    const p = path[0].toLowerCase();
    const key = Object.keys(r).find(k => k.toLowerCase() === p);
    if (key === undefined) {
      return false;
    }
    return this.attrTest(path.slice(1), r[key], op);
  }
  pr(r: any, _?: CompValue): boolean {
    return r !== undefined;
  }
  eq(r: any, v: CompValue): boolean {
    return r === v;
  }
  ne(r: any, v: CompValue): boolean {
    return r !== v;
  }
  gt(r: any, v: CompValue): boolean {
    return v !== null && r > v;
  }
  lt(r: any, v: CompValue): boolean {
    return v !== null && r < v;
  }
  le(r: any, v: CompValue): boolean {
    return v !== null && r <= v;
  }
  ge(r: any, v: CompValue): boolean {
    return v !== null && r >= v;
  }
  sw(r: any, v: CompValue): boolean {
    return v !== null && r !== null && r.toString().startsWith(v.toString());
  }
  ew(r: any, v: CompValue): boolean {
    return v !== null && r !== null && r.toString().endsWith(v.toString());
  }
  // The entire operator value must be a substring of the attribute value for a match.
  co(r: any, v: CompValue): boolean {
    if (typeof r === "object" || v === null) {
      return r == v;
    }
    if (typeof r !== "string") {
      r = r.toString();
    }
    return r.indexOf(v.toString()) !== -1;
  }
}
