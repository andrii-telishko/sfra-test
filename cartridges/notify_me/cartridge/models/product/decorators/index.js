"use strict";

var base = module.superModule;
var assign = require("*/cartridge/scripts/utils/assign");

module.exports = assign(base, {
    notifyAttributes: require("./notifyAttributes"),
});
