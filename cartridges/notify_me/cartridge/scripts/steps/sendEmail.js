"use strict";

function sendEmail() {
    var CustomObjectMgr = require("dw/object/CustomObjectMgr");
    var Transaction = require("dw/system/Transaction");
    var ProductMgr = require("dw/catalog/ProductMgr");
    var emailHelpers = require("*/cartridge/scripts/helpers/emailHelpers");
    var Site = require("dw/system/Site");

    var subscriptions =
        CustomObjectMgr.getAllCustomObjects("NotifySubscription");

    while (subscriptions.hasNext()) {
        var subscription = subscriptions.next();

        Transaction.wrap(function () {
            var productsArr = subscription.custom.ProductId.map(function (
                productId
            ) {
                return productId;
            });

            var productsOutOfStock = productsArr.filter(function (productId) {
                var product = ProductMgr.getProduct(productId);
                var productOutOfStock;

                if (product.availabilityModel.inStock) {
                    var emailObj = {
                        to: subscription.custom.email,
                        subject: "Product in Stock",
                        from: Site.current.getCustomPreferenceValue(
                            "customerServiceEmail"
                        ),
                    };

                    emailHelpers.send(emailObj, "emailText.isml", {});
                } else {
                    productOutOfStock = productId;
                }
                return productOutOfStock;
            });

            var stop = "";

            if (productsOutOfStock.length === 0) {
                CustomObjectMgr.remove(subscription);
            } else {
                subscription.custom.ProductId = productsOutOfStock;
            }
        });
    }
}

module.exports = {
    sendEmail: sendEmail,
};
