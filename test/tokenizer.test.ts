import "mocha";
import { tokenizer, Token } from "../src/parser";
import { EOT } from "./test_util";
import chai = require("chai");
const assert = chai.assert;

describe("tokenizer", () => {
  const tok = (literal: string, type: string) => ({ literal, type }) as Token;

  it("eot", () => {
    assert.deepEqual(tokenizer(""), [EOT]);
  });

  it("false", () => {
    assert.deepEqual(tokenizer("false"), [
      { literal: "false", type: "Word" },
      EOT,
    ]);
  });

  it("userName is AttrPath", () => {
    assert.deepEqual(tokenizer("userName"), [
      { literal: "userName", type: "Word" },
      EOT,
    ]);
  });

  it("userName eq -12", () => {
    assert.deepEqual(
      [tok("userName", "Word"), tok("eq", "Word"), tok("-12", "Number"), EOT],
      tokenizer("userName eq -12"),
    );
  });

  it("0Field1 eq -12", () => {
    assert.deepEqual(
      [tok("0Field1", "Word"), tok("eq", "Word"), tok("-12", "Number"), EOT],
      tokenizer("0Field1 eq -12"),
    );
  });

  it("sub-attribute after ValPath", () => {
    assert.deepEqual(
      tokenizer('emails[type eq "work"].value eq "user@example.com"'),
      [
        tok("emails", "Word"),
        tok("[", "Bracket"),
        tok("type", "Word"),
        tok("eq", "Word"),
        tok('"work"', "Quoted"),
        tok("].", "Bracket"),
        tok("value", "Word"),
        tok("eq", "Word"),
        tok('"user@example.com"', "Quoted"),
        EOT,
      ],
    );
  });

  it("support of quoted values", () => {
    assert.deepEqual(tokenizer('displayName eq "Alice \\"and\\" Bob"'), [
      tok("displayName", "Word"),
      tok("eq", "Word"),
      tok('"Alice \\"and\\" Bob"', "Quoted"),
      EOT,
    ]);
  });
});
