"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.valfilter = function (f, path) {
    if (path && "attrPath" in f) {
        f = __assign(__assign({}, f), { attrPath: path + "." + f.attrPath });
    }
    switch (f.op) {
        case "and":
        case "or":
            return __assign(__assign({}, f), { filters: f.filters.map(function (c) { return exports.valfilter(c, path); }) });
        case "not":
            return __assign(__assign({}, f), { filter: exports.valfilter(f, path) });
        case "[]":
            return exports.valfilter(f.valFilter, f.attrPath);
    }
    return f;
};
exports.log = function (f) {
    switch (f.op) {
        case "and":
        case "or":
            var filters = f.filters.map(exports.log);
            var result_1 = [];
            filters.forEach(function (c) {
                if (c.op == f.op) {
                    c.filters.forEach(function (cc) { return result_1.push(cc); });
                }
                else {
                    result_1.push(c);
                }
            });
            return __assign(__assign({}, f), { filters: result_1 });
    }
    return f;
};
//# sourceMappingURL=flatten.js.map