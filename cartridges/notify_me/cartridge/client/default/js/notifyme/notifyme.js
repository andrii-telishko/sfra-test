"use strict";

var formValidation = require("base/components/formValidation");
var modal = require("../modal/modal");

module.exports = {
    onNotifyMeModalClose: function () {
        $("body").on("hidden.bs.modal", "#notifyMeModal", function () {
            $("#notifyMeModal").remove();
            $(".modal-backdrop").remove();
            $("body").removeClass("modal-open");

            $("#notifyMeModal").siblings().attr("aria-hidden", "false");
        });
    },

    submitNotifyme: function () {
        $("body").on("submit", "form.notifyme-form", function (e) {
            var $form = $(this);
            e.preventDefault();
            var url = $form.attr("action");
            $form.spinner().start();
            $("form.notifyme-form").trigger("notifyForm:submit", e);
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                data: $form.serialize(),
                success: function (data) {
                    $form.spinner().stop();
                    if (!data.success) {
                        formValidation($form, data);
                    } else {
                        modal.displayModal(data.redirectUrl);
                    }
                },
                error: function (err) {
                    if (err.responseJSON.redirectUrl) {
                        window.location.href = err.responseJSON.redirectUrl;
                    }
                    $form.spinner().stop();
                },
            });
            return false;
        });
    },
};
