"use strict";

var server = require("server");
var URLUtils = require("dw/web/URLUtils");

server.get("Show", server.middleware.https, function (req, res, next) {
    var actionUrl = URLUtils.url("NotifyForm-Notify"); // sets the route to call for the form submit action
    var NotifyForm = server.forms.getForm("notifyForm"); // creates empty JSON object using the form definition
    NotifyForm.clear();
    NotifyForm.productId.value = req.querystring.pid;
    res.render("forms/NotifyFormTemplate", {
        actionUrl: actionUrl,
        NotifyForm: NotifyForm,
    });
    next();
});

server.post("Notify", server.middleware.https, function (req, res, next) {
    var CustomObjectMgr = require("dw/object/CustomObjectMgr");
    var NotifyForm = server.forms.getForm("notifyForm");
    var Transaction = require("dw/system/Transaction");
    var email = NotifyForm.email.value;
    var productId = NotifyForm.productId.value;
    var name = NotifyForm.name.value;

    var customObj = CustomObjectMgr.getCustomObject(
        "NotifySubscription",
        email
    );

    Transaction.wrap(function () {
        if (!customObj) {
            var newCustomObj = CustomObjectMgr.createCustomObject(
                "NotifySubscription",
                email
            );
            newCustomObj.custom.ProductId = [productId];
            newCustomObj.custom.name = name;
        } else {
            var products = customObj.custom.ProductId.map(function (productId) {
                return productId;
            });

            var productsSet = products.concat(productId);
            customObj.custom.ProductId = productsSet;
        }
    });

    res.json({
        success: true,
    });

    return next();
});

module.exports = server.exports();
