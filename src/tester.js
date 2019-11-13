"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var Tester = (function () {
    function Tester() {
    }
    Tester.prototype.test = function (r, f) {
        var _this = this;
        switch (f.op) {
            case "or":
                return f.filters.some(function (c) { return _this.test(r, c); });
            case "and":
                return f.filters.every(function (c) { return _this.test(r, c); });
            case "not":
                return !this.test(r, f.filter);
            case "[]":
                return this.attrTest(this.attrPath(f.attrPath), r, function (s) {
                    return _this.test(s, f.valFilter);
                });
            case "pr":
                return this.attrTest(this.attrPath(f.attrPath), r, function (s) { return _this[f.op](s); });
            case "eq":
            case "ne":
            case "co":
            case "sw":
            case "ew":
            case "gt":
            case "lt":
            case "ge":
            case "le":
                return this.attrTest(this.attrPath(f.attrPath), r, function (s) {
                    return _this[f.op](s, f.compValue);
                });
        }
    };
    Tester.prototype.attrPath = function (path) {
        var i = path.lastIndexOf(":");
        if (i === -1) {
            return path.split(".");
        }
        return __spreadArrays([path.substring(0, i)], path.substring(i + 1).split("."));
    };
    Tester.prototype.attrTest = function (path, r, op) {
        var _this = this;
        if (path.length === 0) {
            return op(r);
        }
        if (typeof r !== "object" || r === null) {
            return false;
        }
        if (Array.isArray(r)) {
            return r.some(function (i) { return _this.attrTest(path, i, op); });
        }
        var p = path[0].toLowerCase();
        var key = Object.keys(r).find(function (k) { return k.toLowerCase() === p; });
        if (key === undefined) {
            return false;
        }
        return this.attrTest(path.slice(1), r[key], op);
    };
    Tester.prototype.pr = function (r, _) {
        return r !== undefined;
    };
    Tester.prototype.eq = function (r, v) {
        return r === v;
    };
    Tester.prototype.ne = function (r, v) {
        return r !== v;
    };
    Tester.prototype.gt = function (r, v) {
        return v !== null && r > v;
    };
    Tester.prototype.lt = function (r, v) {
        return v !== null && r < v;
    };
    Tester.prototype.le = function (r, v) {
        return v !== null && r <= v;
    };
    Tester.prototype.ge = function (r, v) {
        return v !== null && r >= v;
    };
    Tester.prototype.sw = function (r, v) {
        return v !== null && r !== null && r.toString().startsWith(v.toString());
    };
    Tester.prototype.ew = function (r, v) {
        return v !== null && r !== null && r.toString().endsWith(v.toString());
    };
    Tester.prototype.co = function (r, v) {
        if (typeof r === "object" || v === null) {
            return r == v;
        }
        if (typeof r !== "string") {
            r = r.toString();
        }
        return r.indexOf(v.toString()) !== -1;
    };
    Tester.UNDEF = Symbol("undefined");
    return Tester;
}());
exports.Tester = Tester;
//# sourceMappingURL=tester.js.map