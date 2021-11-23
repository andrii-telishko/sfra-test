"use strict";

var base = module.superModule;

var PromotionMgr = require("dw/campaign/PromotionMgr");
var ImageModel = require("*/cartridge/models/product/productImages");
var availability = require("*/cartridge/models/product/decorators/availability");
var readyToOrder = require("*/cartridge/models/product/decorators/readyToOrder");
var variationAttributes = require("*/cartridge/models/product/decorators/variationAttributes");
var priceFactory = require("*/cartridge/scripts/factories/price");
var preferences = require("*/cartridge/config/preferences");

// base.createProductListItemObject = function (productListItemObject) {
//     base.createProductListItemObject.call(this, productListItemObject);

//     var wishlistExpirationDate =
//         productListItemObject.custom.wishlistExpirationDate || new Date();

//     result.wishlistExpirationDate = wishlistExpirationDate;
//     result.wishlistDaysToExpire = Math.ceil(
//         (wishlistExpirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
//     );
// };

function getOptions(listItem) {
    var options = listItem.productOptionModel ? [] : false;
    if (options) {
        listItem.productOptionModel.options
            .toArray()
            .forEach(function (option) {
                var selectedOption =
                    listItem.productOptionModel.getSelectedOptionValue(option);
                var result = {
                    displayName: option.displayName,
                    displayValue: selectedOption.displayValue,
                    optionId: option.ID,
                    selectedValueId: selectedOption.ID,
                };
                options.push(result);
            });
    }
    return options;
}

function getMaxOrderQty(productListItemObject) {
    var DEFAULT_MAX_ORDER_QUANTITY = preferences.maxOrderQty || 10;
    var availableToSell;
    if (productListItemObject.product.availabilityModel.inventoryRecord) {
        availableToSell =
            productListItemObject.product.availabilityModel.inventoryRecord.ATS
                .value;
    }
    return Math.min(availableToSell, DEFAULT_MAX_ORDER_QUANTITY);
}

function getBundledListItems(listItem) {
    var bundledItems = [];
    listItem.product.bundledProducts.toArray().forEach(function (bundledItem) {
        var result = {
            pid: bundledItem.ID,
            name: bundledItem.name,
            imageObj: new ImageModel(bundledItem, {
                types: ["small"],
                quantity: "single",
            }),
        };
        if (!bundledItem.master) {
            variationAttributes(result, bundledItem.variationModel, {
                attributes: "*",
                endPoint: "Variation",
            });
        }
        bundledItems.push(result);
    });
    return bundledItems || [];
}

function getSelectedOptions(options) {
    if (options) {
        return options.map(function (option) {
            return {
                optionId: option.optionId,
                selectedValueId: option.selectedValueId,
            };
        });
    }
    return null;
}

function createProductListItemObject(productListItemObject) {
    var result = {};
    var promotions;

    if (productListItemObject) {
        promotions = PromotionMgr.activeCustomerPromotions.getProductPromotions(
            productListItemObject.product
        );
        var options = getOptions(productListItemObject);
        result = {
            pid: productListItemObject.productID,
            UUID: productListItemObject.UUID,
            id: productListItemObject.ID,
            name: productListItemObject.product.name,
            minOrderQuantity:
                productListItemObject.product.minOrderQuantity.value || 1,
            maxOrderQuantity: getMaxOrderQty(productListItemObject),
            qty: productListItemObject.quantityValue,
            lastModified: productListItemObject.getLastModified().getTime(),
            creationDate: productListItemObject.getCreationDate().getTime(),
            publicItem: productListItemObject.public,
            imageObj: new ImageModel(productListItemObject.product, {
                types: ["small"],
                quantity: "single",
            }),
            priceObj: priceFactory.getPrice(
                productListItemObject.product,
                null,
                true,
                promotions,
                null
            ),
            master: productListItemObject.product.master,
            bundle: productListItemObject.product.bundle,
            bundleItems: productListItemObject.product.bundle
                ? getBundledListItems(productListItemObject)
                : [],
            options: options,
            selectedOptions: getSelectedOptions(options),
        };

        var wishlistExpirationDate =
            productListItemObject.custom.wishlistExpirationDate || new Date();

        result.wishlistExpirationDate = wishlistExpirationDate;
        result.wishlistDaysToExpire = Math.ceil(
            (wishlistExpirationDate.getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
        );

        readyToOrder(result, productListItemObject.product.variationModel);
        availability(
            result,
            productListItemObject.quantityValue,
            productListItemObject.product.minOrderQuantity.value,
            productListItemObject.product.availabilityModel
        );
        if (!productListItemObject.product.master) {
            variationAttributes(
                result,
                productListItemObject.product.variationModel,
                {
                    attributes: "*",
                    endPoint: "Variation",
                }
            );
        }
    } else {
        result = null;
    }
    return result;
}

base = function productListItem(productListItemObject) {
    this.productListItem = createProductListItemObject(productListItemObject);
};

module.exports = base;
