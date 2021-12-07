"use strict";

var base = module.superModule;
var assign = require("*/cartridge/scripts/utils/assign");
var URLUtils = require("dw/web/URLUtils");

function get(params) {
    var product = base.get(params);

    product.renderNotifyMe = !product.available;

    if (product.renderNotifyMe) {
        product.renderNotifyMeURL = URLUtils.url(
            "NotifyForm-Show",
            "pid",
            product.id
        )
            .relative()
            .toString();
    }

    return product;
}

module.exports = assign(base, {
    get: get,
});
