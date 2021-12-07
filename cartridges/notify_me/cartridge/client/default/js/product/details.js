"use strict";

var base = require("./base");
var detail = require("./detail");

var exportDetails = $.extend({}, base, detail, {});

module.exports = exportDetails;
