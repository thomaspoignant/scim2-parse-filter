import { eq, and, or } from "./test_util";
import { Filter, parse, flatten } from "../src";
import { assert } from "chai";

function to_s(f: Filter): any {
  switch (f.op) {
    case "or":
    case "and":
      return `${f.op}(${f.filters.map(to_s).join(" ")})`;
    case "eq":
      return `${f.attrPath}=${f.compValue}`;
    default:
      return JSON.stringify(f);
  }
}
const test = (text: string, e: Filter) => {
  it(text, () => {
    assert.equal(to_s(flatten(parse(text))), to_s(e));
  });
};
const make: (num: number) => [Filter, string] = num => [
  eq(`n${num}`, num),
  `n${num} eq ${num}`
];
const [a1, e1] = make(1);
const [a2, e2] = make(2);
const [a3, e3] = make(3);
const [a4, e4] = make(4);
describe("flatten", () => {
  describe("simple", () => {
    test(`(${e1} and ${e2}) and ${e3}`, and(a1, a2, a3));
    test(`(${e1} and (${e2} and ${e4})) and ${e3}`, and(a1, a2, a4, a3));
    test(`(${e1} and ((${e2} and ${e4}))) and ${e3}`, and(a1, a2, a4, a3));
    test(
      `xx[${e1} and ((${e2} and ${e4}))]`,
      and(eq("xx.n1", 1), eq("xx.n2", 2), eq("xx.n4", 4))
    );
  });
  describe("andor", () => {
    test(`(${e1} or ${e2}) and ${e3}`, and(or(a1, a2), a3));
    test(`${e1} or (${e2} and ${e3})`, or(a1, and(a2, a3)));
    test(`(${e1}) or (${e2} and ${e3})`, or(a1, and(a2, a3)));
  });
});
