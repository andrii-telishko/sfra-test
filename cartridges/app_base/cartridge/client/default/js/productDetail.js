"use strict";

var $ = require("jquery");

var processInclude = require("base/util");

$(document).ready(function () {
    processInclude(require("wishlist/product/details"));
    processInclude(require("wishlist/product/wishlist"));
    processInclude(require("giftregistry/product/giftRegistry"));
});
