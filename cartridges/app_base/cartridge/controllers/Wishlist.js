"use strict";

var server = require("server");
var consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
var productListHelper = require("*/cartridge/scripts/productList/productListHelpers");
var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
var URLUtils = require("dw/web/URLUtils");
var Resource = require("dw/web/Resource");
var PAGE_SIZE_ITEMS = 15;
server.extend(module.superModule);

server.append(
    "Show",
    consentTracking.consent,
    server.middleware.https,
    csrfProtection.generateToken,
    function (req, res, next) {
        var list = productListHelper.getList(req.currentCustomer.raw, {
            type: 10,
        });
        var WishlistModel = require("*/cartridge/models/productList");
        var userName = "";
        var firstName;
        var rememberMe = false;
        if (req.currentCustomer.credentials) {
            rememberMe = true;
            userName = req.currentCustomer.credentials.username;
        }
        var loggedIn = req.currentCustomer.profile;

        var target = req.querystring.rurl || 1;
        var actionUrl = URLUtils.url("Account-Login");
        var createAccountUrl = URLUtils.url(
            "Account-SubmitRegistration",
            "rurl",
            target
        )
            .relative()
            .toString();
        var navTabValue = req.querystring.action;
        var breadcrumbs = [
            {
                htmlValue: Resource.msg("global.home", "common", null),
                url: URLUtils.home().toString(),
            },
        ];
        if (loggedIn) {
            firstName = req.currentCustomer.profile.firstName;
            breadcrumbs.push({
                htmlValue: Resource.msg(
                    "page.title.myaccount",
                    "account",
                    null
                ),
                url: URLUtils.url("Account-Show").toString(),
            });
        }

        var profileForm = server.forms.getForm("profile");
        profileForm.clear();
        var wishlistModel = new WishlistModel(list, {
            type: "wishlist",
            publicView: false,
            pageSize: PAGE_SIZE_ITEMS,
            pageNumber: 1,
        }).productList;

        var filteredWishlist = [];

        wishlistModel.items.forEach(function (item) {
            if (item.wishlistDaysToExpire === 0) {
                productListHelper.removeItem(req.currentCustomer.raw, item.id, {
                    type: 10,
                });
            } else {
                filteredWishlist.push(item);
            }
        });

        wishlistModel.items = filteredWishlist;

        res.setViewData({ wishlist: wishlistModel });

        next();
    }
);

module.exports = server.exports();
