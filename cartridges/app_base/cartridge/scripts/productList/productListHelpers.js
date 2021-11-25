"use strict";

var base = module.superModule;
var assign = require("*/cartridge/scripts/utils/assign");

function addItem(list, pid, config) {
    var context = base.addItem(list, pid, config);
    var Site = require("dw/system/Site");
    var Transaction = require("dw/system/Transaction");

    if (context) {
        var sitePref = Site.getCurrent().getPreferences();
        var timeToLiveInWishlist = sitePref.getCustom().expareDay;
        var expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + timeToLiveInWishlist);

        var productlistItem = base.getItemFromList(list, pid);

        Transaction.wrap(function () {
            productlistItem.custom.wishlistExpirationDate = expiryDate;
        });

        return true;
    }

    return false;
}

function removeExpiredWishlistItem(customer, config) {
    var list = base.getCurrentOrNewList(customer, config);

    if (list.type !== 10) {
        return;
    }

    var Transaction = require("dw/system/Transaction");

    try {
        Transaction.wrap(function () {
            list.items.toArray().forEach(function (item) {
                var wishlistDaysToExpire = Math.ceil(
                    (item.custom.wishlistExpirationDate.getTime() -
                        Date.now()) /
                        (1000 * 60 * 60 * 24)
                );
                if (wishlistDaysToExpire <= 0) {
                    list.removeItem(item);
                }
            });
        });
    } catch (error) {
        return;
    }
}

function getList(customer, config) {
    var list = base.getList(customer, config);

    if (list) {
        removeExpiredWishlistItem(customer, config);
    }

    return list;
}

module.exports = assign(base, {
    addItem: addItem,
    getList: getList,
});
