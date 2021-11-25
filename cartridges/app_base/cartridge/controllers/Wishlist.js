"use strict";

var server = require("server");
server.extend(module.superModule);

var productListHelper = require("*/cartridge/scripts/productList/productListHelpers");

server.append("EditProductListItem", function (req, res, next) {
    var productId = req.form.pid;
    var productList = productListHelper.getList(req.currentCustomer.raw, {
        type: 10,
    });

    if (productList && productList.type === 10) {
        try {
            var Transaction = require("dw/system/Transaction");
            var Site = require("dw/system/Site");

            Transaction.wrap(function () {
                var item = productListHelper.getItemFromList(
                    productList,
                    productId
                );

                var sitePref = Site.getCurrent().getPreferences();
                var timeToLiveInWishlist = sitePref.getCustom().expareDay;
                var expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + timeToLiveInWishlist);

                item.custom.wishlistExpirationDate = expiryDate;
            });

            productListHelper.updateWishlistPrivacyCache(
                req.currentCustomer.raw,
                req,
                { type: 10 }
            );
        } catch (e) {
            res.json({
                error: true,
            });
            return next();
        }
    }

    res.json({
        success: true,
    });

    return next();
});

module.exports = server.exports();
