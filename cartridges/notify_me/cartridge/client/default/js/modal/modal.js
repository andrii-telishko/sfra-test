"use strict";

/**
 * Generates the modal window on the first call.
 *
 */
function getModalHtmlElement() {
    if ($("#notifyMeModal").length !== 0) {
        $("#notifyMeModal").remove();
    }
    var htmlString =
        "<!-- Modal -->" +
        '<div class="modal fade" id="notifyMeModal" tabindex="-1" role="dialog">' +
        '<span class="enter-message sr-only" ></span>' +
        '<div class="modal-dialog quick-view-dialog">' +
        "<!-- Modal content-->" +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '    <button type="button" class="close pull-right" data-dismiss="modal">' +
        '        <span aria-hidden="true">&times;</span>' +
        '        <span class="sr-only"> </span>' +
        "    </button>" +
        "</div>" +
        '<div class="modal-body"></div>' +
        '<div class="modal-footer"></div>' +
        "</div>" +
        "</div>" +
        "</div>";
    $("body").append(htmlString);
}

/**
 * replaces the content in the modal window for product variation to be edited.
 * @param {string} url - url to be used to retrieve a form html content
 */
function fillModalElement(url) {
    $("#notifyMeModal").spinner().start();

    $.ajax({
        url: url,
        method: "GET",
        success: function (data) {
            $("#notifyMeModal .modal-body").empty();
            $("#notifyMeModal .modal-body").html(data);
            $("#notifyMeModal").modal("show");
            $.spinner().stop();
        },
        error: function () {
            $("#notifyMeModal").spinner().stop();
        },
    });
}

module.exports = {
    displayModal: function (url) {
        $("body").trigger("notifyForm:show");
        getModalHtmlElement();
        fillModalElement(url);
        require("base/components/clientSideValidation").submit();
        require("base/components/clientSideValidation").invalid();
    },
};
