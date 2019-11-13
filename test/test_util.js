"use strict";
exports.__esModule = true;
exports.EOT = { literal: "", type: "EOT" };
function eq(attrPath, compValue) {
    return { op: "eq", attrPath: attrPath, compValue: compValue };
}
exports.eq = eq;
function and() {
    var filters = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        filters[_i] = arguments[_i];
    }
    return { op: "and", filters: filters };
}
exports.and = and;
function or() {
    var filters = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        filters[_i] = arguments[_i];
    }
    return { op: "or", filters: filters };
}
exports.or = or;
function op(op, attrPath, compValue) {
    return { op: op, attrPath: attrPath, compValue: compValue };
}
exports.op = op;
function v(attrPath, valFilter) {
    return { op: "[]", attrPath: attrPath, valFilter: valFilter };
}
exports.v = v;
function pr(attrPath) {
    return { op: "pr", attrPath: attrPath };
}
exports.pr = pr;
//# sourceMappingURL=test_util.js.map