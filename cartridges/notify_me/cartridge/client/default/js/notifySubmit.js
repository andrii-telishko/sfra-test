"use strict";

var formValidation = require("base/components/formValidation");

module.exports = {
    submitNotify: function () {
        $("form.notify-submit").submit(function (e) {
            var form = $(this);
            e.preventDefault();
            var url = form.attr("action");
            form.spinner().start();
            $("form.notify-submit").trigger("notify-submit:submit", e);
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                data: form.serialize(),
                success: function (data) {
                    form.spinner().stop();
                    if (!data.success) {
                        formValidation(form, data);
                        $("form.notify-submit").trigger(
                            "notify-submit:error",
                            data
                        );
                    } else {
                        $("form.notify-submit").trigger(
                            "notify-submit:success",
                            data
                        );
                    }
                },
                error: function (data) {
                    if (data.responseJSON.redirectUrl) {
                        window.location.href = data.responseJSON.redirectUrl;
                    } else {
                        $("form.notify-submit").trigger(
                            "notify-submit:error",
                            data
                        );
                        form.spinner().stop();
                    }
                },
            });
            return false;
        });
    },
};
