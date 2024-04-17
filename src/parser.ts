import { Filter, Compare, NotFilter, Suffix, ValuePath } from "./index";

type TokenType = "Number" | "Quoted" | "Bracket" | "Word" | "EOT";
const EOT = { type: "EOT" as TokenType, literal: "" };

export type Token = {
  type: TokenType;
  literal: string;
};
export function tokenizer(f: string): Token[] {
  const ret: Token[] = [];
  let rest = f;
  const patterns = /^(?:(\s+)|(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?(?![-\w._:\/\)\s]))|("(?:[^"\\]|\\.|\n)*")|([[()]|]\.?)|(\w[-\w._:\/%]*))/;
  let n;
  while ((n = patterns.exec(rest))) {
    if (n[1] || n[0].length === 0) {
      //
    } else if (n[2]) {
      ret.push({ literal: n[2], type: "Number" });
    } else if (n[3]) {
      const literal = n[3].replace(/\\(?!")/g, '\\\\');
      ret.push({ literal, type: "Quoted" });
    } else if (n[4]) {
      ret.push({ literal: n[4], type: "Bracket" });
    } else if (n[5]) {
      ret.push({ literal: n[5], type: "Word" });
    }
    rest = rest.substring(n.index + n[0].length);
  }
  if (rest.length !== 0) {
    throw new Error(`unexpected token ${rest}`);
  }
  ret.push(EOT);
  return ret;
}
export class Tokens implements TokenList {
  i: number;

  private current: Token | undefined;
  getList() {
    return this.list.map((a, i) =>
      i == this.i ? `[${a.literal}]` : a.literal
    );
  }
  peek(): Token {
    return this.current || EOT;
  }
  constructor(private list: Token[]) {
    this.i = 0;
    this.current = this.list[this.i];
  }
  forward(): TokenList {
    this.current = this.list[++this.i];
    return this;
  }
  shift(): Token {
    const c = this.peek();
    this.forward();
    return c;
  }
}
interface TokenList {
  peek(): Token;
  forward(): TokenList;
  shift(): Token;
}

const cops = new Set(["eq", "ne", "co", "sw", "ew", "gt", "lt", "ge", "le"]);
const sops = new Set(["pr"]);


export function parseFilter(list: TokenList): Filter {
  return parseInxif(parseExpression(list), list, Precedence.LOWEST);
}
export function parseExpression(list: TokenList): Filter {
  const t = list.shift();
  if (t.literal == "(") {
    const filter = parseFilter(list);
    const close = list.shift();
    if (close.literal !== ")") {
      throw new Error(
        `Unexpected token [${close.literal}(${close.type})] expected ')'`
      );
    }
    return filter;
  } else if (t.literal.toLowerCase() == "not") {
    const notFilter: NotFilter = { op: "not", filter: parseExpression(list) };
    return parseInxif(notFilter, list, Precedence.NOT);
  } else if (t.type == "Word") {
    return readValFilter(t, list);
  } else {
    throw new Error(`Unexpected token ${t.literal} (${t.type})`);
  }
}
enum Precedence {
  LOWEST = 1,
  OR = 2,
  AND = 3,
  NOT = 4
}
const PRECEDENCE: { [key: string]: Precedence } = {
  'or': Precedence.OR,
  'and': Precedence.AND,
  'not': Precedence.NOT
}
function parseInxif(left: Filter, list: TokenList, precede: Precedence): Filter {
  const op = list.peek().literal.toLowerCase();
  const p = PRECEDENCE[op];
  if (!p || precede >= p) {
    return left;
  }
  const filters = [left];
  while (list.peek().literal.toLowerCase() === op) {
    let r = parseExpression(list.forward());
    const rr = list.peek().literal.toLowerCase();
    if (PRECEDENCE[rr] > p) {
      r = parseInxif(r, list, p);
    }
    filters.push(r);
  }
  return parseInxif({ op, filters } as Filter, list, precede);
}
function readValFilter(left: Token, list: TokenList): Filter {
  if (left.type !== "Word") {
    throw new Error(`Unexpected token ${left.literal} expected Word`);
  }
  const attrPath = left.literal;
  const t = list.shift();
  const op = t.literal.toLowerCase();
  if (cops.has(op)) {
    const compValue = parseCompValue(list);
    return { op, attrPath, compValue } as Compare;
  } else if (sops.has(op)) {
    return { op, attrPath } as Suffix;
  } else if (op === "[") {
    const valFilter = parseFilter(list);
    const close = list.shift();
    if (close.literal[0] !== "]") {
      throw new Error(`Unexpected token ${close.literal} expected ']'`);
    }
    const valPath: ValuePath = { op: "[]", attrPath, valFilter };

    if (close.literal[1] !== "." || list.peek().type !== "Word") {
      return valPath
    }

    // convert a sub-attribute after a value-path to an 'and' op
    const next = list.shift()
    next.literal = `${attrPath}.${next.literal}`
    return { op: 'and', filters: [valPath, readValFilter(next, list)] }
  } else {
    throw new Error(
      `Unexpected token ${attrPath} ${t.literal} as valFilter operator`
    );
  }
}

function parseCompValue(list: TokenList): Compare["compValue"] {
  const t = list.shift();
  try {
    const v = JSON.parse(t.literal);
    if (
      v === null ||
      typeof v == "string" ||
      typeof v == "number" ||
      typeof v == "boolean"
    ) {
      return v;
    } else {
      throw new Error(`${t.literal} is ${typeof v} (un supported value)`);
    }
  } catch (e) {
    throw new Error(`[${t.literal}(${t.type})] is not json`);
  }
}
