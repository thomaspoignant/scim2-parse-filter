import "mocha";
import { tokenizer, Token } from "../src/parser";
import { EOT } from './test_util';
import chai = require("chai");
const assert = chai.assert;

describe("tokenizer", () => {
  const tok = (literal: string, type: string) => ({ literal, type } as Token);
  it("eot", () => {
    assert.deepEqual(tokenizer(""), [EOT]);
  });
  it("false", () => {
    assert.deepEqual(tokenizer("false"), [
      { literal: "false", type: "Word" },
      EOT
    ]);
  });
  it("userName is AttrPath", () => {
    assert.deepEqual(tokenizer("userName"), [
      { literal: "userName", type: "Word" },
      EOT
    ]);
  });

  it("userName eq -12", () => {
    assert.deepEqual(
      [tok("userName", "Word"), tok("eq", "Word"), tok("-12", "Number"), EOT],
      tokenizer("userName eq -12")
    );
  });
});
