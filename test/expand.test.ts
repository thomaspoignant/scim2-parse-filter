import { eq, and, or, pr } from "./test_util";
import { Filter, parse, expand } from "../src";
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
const test = (text: string, expected: Filter) => {
  it(text, () => {
    const actual = expand(parse(text));
    assert.equal(to_s(actual), to_s(expected));
  });
};
const make: (num: number) => [Filter, string] = (num) => [
  eq(`n${num}`, num),
  `n${num} eq ${num}`,
];
const [a1, e1] = make(1);
const [a2, e2] = make(2);
const [a3, e3] = make(3);
const [a4, e4] = make(4);
const [a5, e5] = make(5);
const [a6, e6] = make(6);
const [a7, e7] = make(7);

describe("expand", () => {
  describe("no-ops", () => {
    test(e1, eq("n1", 1));
    test("value pr", pr("value"));
    test(`${e1} and ${e2}`, and(a1, a2));
    test(`${e1} or ${e2}`, or(a1, a2));
  });

  describe("value paths", () => {
    test(`p1[${e1}]`, eq("p1.n1", 1));
    test(`p1[p2[${e1}]]`, eq("p1.p2.n1", 1));
  });

  describe("distributing 'and's", () => {
    test(`(${e1} and ${e2}) or ${e3}`, or(and(a1, a2), a3));
    test(`(${e1} or ${e2}) and ${e3}`, or(and(a1, a3), and(a2, a3)));
    test(`${e1} and (${e2} or ${e3})`, or(and(a1, a2), and(a1, a3)));
    test(
      `(${e1} or ${e2}) and (${e3} or ${e4})`,
      or(and(a1, a3), and(a1, a4), and(a2, a3), and(a2, a4))
    );
    test(
      `${e1} and (${e2} or ${e3}) and ${e4} and (${e5} or ${e6}) and ${e7}`,
      or(
        and(a1, a2, a4, a5, a7),
        and(a1, a2, a4, a6, a7),
        and(a1, a3, a4, a5, a7),
        and(a1, a3, a4, a6, a7)
      )
    );
  });

  describe("complex", () => {
    test(
      `${e1} and (${e2} and (${e3} or p1[${e4}]))`,
      or(and(a1, and(a2, a3)), and(a1, and(a2, eq("p1.n4", 4))))
    );
    test(
      `${e1} and (p1[${e2} or ${e3}])`,
      or(and(a1, eq("p1.n2", 2)), and(a1, eq("p1.n3", 3)))
    );
    test(
      `${e1} and (${e2} or (${e3} and (${e4} or ${e5})))`,
      or(and(a1, a2), or(and(a1, and(a3, a4)), and(a1, and(a3, a5))))
    );
    test(
      `${e1} or (${e2} and (${e3} or ${e4}))`,
      or(a1, or(and(a2, a3), and(a2, a4)))
    );
  });
});
