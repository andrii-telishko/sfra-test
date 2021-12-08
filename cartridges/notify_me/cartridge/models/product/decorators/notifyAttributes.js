"use strict";

var URLUtils = require("dw/web/URLUtils");

module.exports = function (object, apiProduct) {
    Object.defineProperty(object, "renderNotifyMe", {
        enumerable: true,
        value: !object.available,
    });

    if (object.renderNotifyMe) {
        Object.defineProperty(object, "renderNotifyMeUrl", {
            enumerable: true,
            value: URLUtils.url("NotifyForm-Show", "pid", object.id)
                .relative()
                .toString(),
        });
    }
};
