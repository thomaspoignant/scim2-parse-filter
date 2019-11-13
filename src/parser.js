"use strict";
exports.__esModule = true;
var EOT = { type: "EOT", literal: "" };
function tokenizer(f) {
    var ret = [];
    var rest = f;
    var patterns = /^(?:(\s+)|(-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?)|("(?:[^"]|\\.|\n)*")|([[\]()])|(\w[-\w\._:\/%]*))/;
    var n;
    while ((n = patterns.exec(rest))) {
        if (n[1] || n[0].length === 0) {
        }
        else if (n[2]) {
            ret.push({ literal: n[2], type: "Number" });
        }
        else if (n[3]) {
            ret.push({ literal: n[3], type: "Quoted" });
        }
        else if (n[4]) {
            ret.push({ literal: n[4], type: "Blacket" });
        }
        else if (n[5]) {
            ret.push({ literal: n[5], type: "Word" });
        }
        rest = rest.substring(n.index + n[0].length);
    }
    if (rest.length !== 0) {
        throw new Error("unexpected token " + rest);
    }
    ret.push(EOT);
    return ret;
}
exports.tokenizer = tokenizer;
var Tokens = (function () {
    function Tokens(list) {
        this.list = list;
        this.i = 0;
        this.current = this.list[this.i];
    }
    Tokens.prototype.getList = function () {
        var _this = this;
        return this.list.map(function (a, i) {
            return i == _this.i ? "[" + a.literal + "]" : a.literal;
        });
    };
    Tokens.prototype.peek = function () {
        return this.current || EOT;
    };
    Tokens.prototype.forward = function () {
        this.current = this.list[++this.i];
        return this;
    };
    Tokens.prototype.shift = function () {
        var c = this.peek();
        this.forward();
        return c;
    };
    return Tokens;
}());
exports.Tokens = Tokens;
var cops = new Set(["eq", "ne", "co", "sw", "ew", "gt", "lt", "ge", "le"]);
var sops = new Set(["pr"]);
function parseFilter(list) {
    return parseInxif(parseExpression(list), list, Precedence.LOWEST);
}
exports.parseFilter = parseFilter;
function parseExpression(list) {
    var t = list.shift();
    if (t.literal == "(") {
        var filter = parseFilter(list);
        var close_1 = list.shift();
        if (close_1.literal !== ")") {
            throw new Error("Unexpected token [" + close_1.literal + "(" + close_1.type + ")] expected ')'");
        }
        return filter;
    }
    else if (t.literal.toLowerCase() == "not") {
        return { op: "not", filter: parseFilter(list) };
    }
    else if (t.type == "Word") {
        return readValFilter(t, list);
    }
    else {
        throw new Error("Unexpected token " + t.literal + " (" + t.type + ")");
    }
}
exports.parseExpression = parseExpression;
var Precedence;
(function (Precedence) {
    Precedence[Precedence["LOWEST"] = 1] = "LOWEST";
    Precedence[Precedence["OR"] = 2] = "OR";
    Precedence[Precedence["AND"] = 3] = "AND";
})(Precedence || (Precedence = {}));
var PRECEDENCE = {
    'or': Precedence.OR,
    'and': Precedence.AND
};
function parseInxif(left, list, precede) {
    var op = list.peek().literal.toLowerCase();
    var p = PRECEDENCE[op];
    if (!p || precede >= p) {
        return left;
    }
    var filters = [left];
    while (list.peek().literal.toLowerCase() === op) {
        var r = parseExpression(list.forward());
        var rr = list.peek().literal.toLowerCase();
        if (PRECEDENCE[rr] > p) {
            r = parseInxif(r, list, p);
        }
        filters.push(r);
    }
    return parseInxif({ op: op, filters: filters }, list, precede);
}
function readValFilter(left, list) {
    if (left.type !== "Word") {
        throw new Error("Unexpected token " + left.literal + " expected Word");
    }
    var attrPath = left.literal;
    var t = list.shift();
    var op = t.literal.toLowerCase();
    if (cops.has(op)) {
        var compValue = parseCompValue(list);
        return { op: op, attrPath: attrPath, compValue: compValue };
    }
    else if (sops.has(op)) {
        return { op: op, attrPath: attrPath };
    }
    else if (op == "[") {
        var valFilter = parseFilter(list);
        var close_2 = list.shift();
        if (close_2.literal !== "]") {
            throw new Error("Unexpected token " + close_2.literal + " expected ']'");
        }
        return { op: "[]", attrPath: attrPath, valFilter: valFilter };
    }
    else {
        throw new Error("Unexpected token " + attrPath + " " + t.literal + " as valFilter operator");
    }
}
function parseCompValue(list) {
    var t = list.shift();
    try {
        var v = JSON.parse(t.literal);
        if (v === null ||
            typeof v == "string" ||
            typeof v == "number" ||
            typeof v == "boolean") {
            return v;
        }
        else {
            throw new Error(t.literal + " is " + typeof v + " (un supported value)");
        }
    }
    catch (e) {
        throw new Error("[" + t.literal + "(" + t.type + ")] is not json");
    }
}
//# sourceMappingURL=parser.js.map