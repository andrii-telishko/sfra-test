"use strict";

var server = require("server");
var URLUtils = require("dw/web/URLUtils");

server.get("Show", server.middleware.https, function (req, res, next) {
    var actionUrl = URLUtils.url("NotifyForm-Notify"); // sets the route to call for the form submit action
    var NotifyForm = server.forms.getForm("notifyForm"); // creates empty JSON object using the form definition
    NotifyForm.clear();
    NotifyForm.productId.value = "73910532-5M";
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

    Transaction.wrap(function () {
        var customObj = CustomObjectMgr.createCustomObject(
            "NotifySubscription",
            email
        );
        customObj.custom.ProductId = productId;
    });

    res.render("postFormTemplate");

    return next();
});

module.exports = server.exports();
