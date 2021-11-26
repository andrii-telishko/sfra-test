"use strict";

var processInclude = require("./util");

$(document).ready(function () {
    processInclude(require("./product/detail"));
    processInclude(require("./product/wishlist"));
    processInclude(require("./product/giftRegistry"));
});
