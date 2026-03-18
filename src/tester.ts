import { Filter, Compare } from "./index";

type CompValue = Compare["compValue"];

export type CaseExactResolver = (attrPath: string) => boolean;
export interface FilterOptions {
  caseExact?: boolean | CaseExactResolver;
}

export class Tester {
  constructor(private readonly options: FilterOptions = {}) {}
  static readonly UNDEF = Symbol("undefined");

  private isCaseExact(attrPath: string): boolean {
    const ce = this.options.caseExact;
    if (typeof ce === "function") return ce(attrPath);
    return ce === true;
  }

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
          this[f.op](s, f.compValue, f.attrPath)
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
  eq(r: any, v: CompValue, attrPath?: string): boolean {
    if (typeof r === "string" && typeof v === "string" && !this.isCaseExact(attrPath ?? "")) {
      return r.toLowerCase() === v.toLowerCase();
    }
    return r === v;
  }
  ne(r: any, v: CompValue, attrPath?: string): boolean {
    if (typeof r === "string" && typeof v === "string" && !this.isCaseExact(attrPath ?? "")) {
      return r.toLowerCase() !== v.toLowerCase();
    }
    return r !== v;
  }
  gt(r: any, v: CompValue, attrPath?: string): boolean {
    if (typeof r === "string" && typeof v === "string" && !this.isCaseExact(attrPath ?? "")) {
      return r.toLowerCase() > v.toLowerCase();
    }
    return v !== null && r > v;
  }
  lt(r: any, v: CompValue, attrPath?: string): boolean {
    if (typeof r === "string" && typeof v === "string" && !this.isCaseExact(attrPath ?? "")) {
      return r.toLowerCase() < v.toLowerCase();
    }
    return v !== null && r < v;
  }
  le(r: any, v: CompValue, attrPath?: string): boolean {
    if (typeof r === "string" && typeof v === "string" && !this.isCaseExact(attrPath ?? "")) {
      return r.toLowerCase() <= v.toLowerCase();
    }
    return v !== null && r <= v;
  }
  ge(r: any, v: CompValue, attrPath?: string): boolean {
    if (typeof r === "string" && typeof v === "string" && !this.isCaseExact(attrPath ?? "")) {
      return r.toLowerCase() >= v.toLowerCase();
    }
    return v !== null && r >= v;
  }
  sw(r: any, v: CompValue, attrPath?: string): boolean {
    if (v === null || r === null) return false;
    if (typeof r === "string" && typeof v === "string" && !this.isCaseExact(attrPath ?? "")) {
      return r.toLowerCase().startsWith(v.toLowerCase());
    }
    return r.toString().startsWith(v.toString());
  }
  ew(r: any, v: CompValue, attrPath?: string): boolean {
    if (v === null || r === null) return false;
    if (typeof r === "string" && typeof v === "string" && !this.isCaseExact(attrPath ?? "")) {
      return r.toLowerCase().endsWith(v.toLowerCase());
    }
    return r.toString().endsWith(v.toString());
  }
  // The entire operator value must be a substring of the attribute value for a match.
  co(r: any, v: CompValue, attrPath?: string): boolean {
    if (typeof r === "object" || v === null) {
      return r == v;
    }
    if (typeof r === "string" && typeof v === "string" && !this.isCaseExact(attrPath ?? "")) {
      return r.toLowerCase().indexOf(v.toLowerCase()) !== -1;
    }
    if (typeof r !== "string") {
      r = r.toString();
    }
    return r.indexOf(v.toString()) !== -1;
  }
}
