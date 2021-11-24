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

module.exports = assign(base, {
    addItem: addItem,
});
