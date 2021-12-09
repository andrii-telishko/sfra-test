"use strict";

var $ = require("jquery");

var processInclude = require("./util");

$(document).ready(function () {
    processInclude(require("notifyme/product/details"));
    processInclude(require("notifyme/notifyme/notifyme"));
    processInclude(require("./product/wishlist"));
    processInclude(require("./product/giftRegistry"));
});
