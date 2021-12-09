"use strict";

var base = module.superModule;
var decorators = require("*/cartridge/models/product/decorators/index");

function fullProduct(product, apiProduct, options) {
    var product = base(product, apiProduct, options);

    decorators.notifyAttributes(product);

    return product;
}

module.exports = fullProduct;
