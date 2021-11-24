"use strict";

var base = module.superModule;

function productListItem(productListItemObject) {
    base.call(this, productListItemObject);

    var wishlistExpirationDate =
        productListItemObject.custom.wishlistExpirationDate || new Date();

    this.productListItem.wishlistExpirationDate = wishlistExpirationDate;
    this.productListItem.wishlistDaysToExpire = Math.ceil(
        (wishlistExpirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
}

module.exports = productListItem;
