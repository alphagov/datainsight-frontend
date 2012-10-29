var GOVUK = GOVUK || {};

GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.formatSuccessOverlay = function () {

    var currentHoverEffects = [];
    var HOVER_SELECTOR = '#format-success-hover';

    var selector = function(format, elementType){
        return elementType + '[data-format='+format+']';
    }

    function HoverBox() {
        var TOP_OFFSET = 5, LEFT_OFFSET = 2;


        var hoverDetailsText = function (data) {
            return [ (data[0].total / 1000).toFixed(1) + "k times used" ,
                (data[0].percentageOfSuccess).toFixed(1) + "% used successfully"];
        };

        this.destroy = function () {
            $(HOVER_SELECTOR).hide(0, function () {
                $(HOVER_SELECTOR).css({top:0, left:0});
            });
        };

        this.init = function (format, data) {

            var labelElement = $(selector(format, "text")),
                labelOffset = labelElement.offset(),
                scrollOffset = {top:labelElement.scrollTop(), left:labelElement.scrollLeft()},
                hoverElement = $(HOVER_SELECTOR);

            var formatName = $(labelElement).text(),
                details = hoverDetailsText(data),
                offset = {top:labelOffset.top + scrollOffset.top - LEFT_OFFSET, left:labelOffset.left + scrollOffset.left - TOP_OFFSET};


            hoverElement.offset(offset);
            hoverElement.data('format', format)
            hoverElement.find('.format').text(formatName);
            hoverElement.find('.details').html(details.join("<br />"));

            hoverElement.show(0);
        };
    }

    function CircleOverlay() {
        var circle = {};

        this.destroy = function () {
            circle.classed('hover', false);
            circle.style('stroke', "#ffffff");
        };

        this.init = function (format) {
            circle = d3.select(selector(format, "circle"));
            circle.classed('hover', true);
            var fillColour = new GOVUK.Insights.colors(circle.attr('fill'));
            circle.style('stroke', fillColour.multiplyWithSelf().asCSS());
            // Append the circle to its parent to put it to the front
            circle.node().parentNode.appendChild(circle.node());
        }
    }


    var onHover = function () {
        d3.event.stopPropagation();
        onHoverOut();

        var format = d3.select(this).attr('data-format'),
            data = d3.select(this).data();


        var hoverBox = new HoverBox();
        hoverBox.init(format, data);
        currentHoverEffects.push(hoverBox);

        var circleOverlay = new CircleOverlay();
        circleOverlay.init(format);
        currentHoverEffects.push(circleOverlay);
    };

    var onHoverOut = function () {
        if (!$(HOVER_SELECTOR).is(":hover")) {
            for (var i = 0; i < currentHoverEffects.length; i++) {
                currentHoverEffects[i].destroy();
            }
            currentHoverEffects = [];
        }
    };

    return {
        onHover:onHover,
        onHoverOut:onHoverOut
    }
}();

setTimeout(function () {
    $('svg:text[data-format=benefits]').trigger('mouseover');
}, 500);