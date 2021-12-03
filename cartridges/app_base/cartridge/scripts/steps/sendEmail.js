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
            var subscriptionData = {
                email: subscription.custom.email,
                productId: subscription.custom.ProductId,
            };

            var product = ProductMgr.getProduct(subscriptionData.productId);

            if (!product.availabilityModel.inStock) return;

            var emailObj = {
                to: subscriptionData.email,
                subject: "Product in Stock",
                from: Site.current.getCustomPreferenceValue(
                    "customerServiceEmail"
                ),
            };

            CustomObjectMgr.remove(subscription);

            emailHelpers.send(emailObj, "emailText.isml", {});
        });
    }
}

module.exports = {
    sendEmail: sendEmail,
};
