import { Compare, Filter, ValuePath, Suffix } from "../src";

export const EOT = { literal: "", type: "EOT" };
export function eq(attrPath: string, compValue: any): Compare {
  return { op: "eq", attrPath, compValue };
}
export function and(...filters: Filter[]): Filter {
  return { op: "and", filters };
}
export function or(...filters: Filter[]): Filter {
  return { op: "or", filters };
}
export function op(op: string, attrPath: string, compValue: any): Compare {
  return { op, attrPath, compValue } as Compare;
}
export function v(attrPath: string, valFilter: Filter): ValuePath {
  return { op:"[]", attrPath, valFilter };
}
export function pr(attrPath: string): Suffix {
  return { op: "pr", attrPath };
}
