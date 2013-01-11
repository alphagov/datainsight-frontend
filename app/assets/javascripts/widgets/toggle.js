var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.wireToggle = function (id) {
    $(id).on("click", function () {
        var classToHide = $(this).data("hide-or-show");
        $("." + classToHide).toggle();
        $(this).toggleClass("open");
    });

    $(window).on("resize", function() {
        if (!$(id).is(":visible")) {
            var classToShow = $(id).data("hide-or-show");
            $("." + classToShow).show();
        }
    });
};

$(function () {
    GOVUK.Insights.wireToggle("#menu-toggle");
});