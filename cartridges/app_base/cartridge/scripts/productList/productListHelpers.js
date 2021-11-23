var base = module.superModule;

// base.addItem = function (list, pid, config) {
//     base.addItem.call(this, list, pid, config);

//     var Site = require("dw/system/Site");

//     var sitePref = Site.getCurrent().getPreferences();
//     var timeToLiveInWishlist = sitePref.getCustom().expareDay;
//     var expiryDate = new Date();
//     expiryDate.setDate(expiryDate.getDate() + timeToLiveInWishlist);

//     productlistItem.custom.wishlistExpirationDate = expiryDate;
// };

// module.exports = base;

base.addItem = function (list, pid, config) {
    var Transaction = require("dw/system/Transaction");
    var Site = require("dw/system/Site");

    if (!list) {
        return false;
    }

    var itemExist = base.itemExists(list, pid, config);

    if (!itemExist) {
        var ProductMgr = require("dw/catalog/ProductMgr");

        var apiProduct = ProductMgr.getProduct(pid);

        if (apiProduct.variationGroup) {
            return false;
        }

        if (apiProduct && list && config.qty) {
            try {
                Transaction.wrap(function () {
                    var productlistItem = list.createProductItem(apiProduct);

                    if (apiProduct.optionProduct) {
                        var optionModel = apiProduct.getOptionModel();
                        var option = optionModel.getOption(config.optionId);
                        var optionValue = optionModel.getOptionValue(
                            option,
                            config.optionValue
                        );

                        optionModel.setSelectedOptionValue(option, optionValue);
                        productlistItem.setProductOptionModel(optionModel);
                    }

                    if (apiProduct.master) {
                        productlistItem.setPublic(false);
                    }

                    productlistItem.setQuantityValue(config.qty);

                    var sitePref = Site.getCurrent().getPreferences();
                    var timeToLiveInWishlist = sitePref.getCustom().expareDay;
                    var expiryDate = new Date();
                    expiryDate.setDate(
                        expiryDate.getDate() + timeToLiveInWishlist
                    );

                    productlistItem.custom.wishlistExpirationDate = expiryDate;
                });
            } catch (e) {
                return false;
            }
        }

        if (config.type === 10) {
            base.updateWishlistPrivacyCache(
                config.req.currentCustomer.raw,
                config.req,
                config
            );
        }

        return true;
    } else if (itemExist && config.type === 11) {
        Transaction.wrap(function () {
            itemExist.setQuantityValue(itemExist.quantityValue + config.qty);
        });

        return true;
    }

    return false;
};

module.exports = base;
