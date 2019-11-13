"use strict";
exports.__esModule = true;
var toknizer = require("./parser");
var tester = require("./tester");
var fl = require("./flatten");
exports.Tester = tester.Tester;
function filter(filter) {
    var tester = new exports.Tester();
    return function (r) { return tester.test(r, filter); };
}
exports.filter = filter;
function parse(query) {
    var l = new toknizer.Tokens(toknizer.tokenizer(query));
    var filter = toknizer.parseFilter(l);
    if (l.peek().type !== "EOT") {
        throw new Error("unexpected EOT " + l.getList());
    }
    return filter;
}
exports.parse = parse;
function flatten(f) {
    return fl.log(fl.valfilter(f));
}
exports.flatten = flatten;
//# sourceMappingURL=index.js.map