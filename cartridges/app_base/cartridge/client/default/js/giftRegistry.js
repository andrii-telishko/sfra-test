"use strict";

var processInclude = require("./util");

$(document).ready(function () {
    processInclude(require("./giftRegistry/giftRegistry")(["m", "d", "Y"]));
});
