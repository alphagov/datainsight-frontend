var GOVUK = GOVUK || {};

GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.formatSuccessOverlay = function () {

    var HOVER_SELECTOR = '#format-success-hover';

    var selector = function (format, elementType) {
        return elementType + '[data-format=' + format + ']';
    };

    var notSelector = function (format, elementType) {
        return elementType + ':not([data-format=' + format + '])';
    };

    function HoverBox() {
        var TOP_OFFSET = 2, LEFT_OFFSET = 7;


        var hoverDetailsText = function (data) {
            return [ (data[0].total / 1000).toFixed(1) + "k times used" ,
                (data[0].percentageOfSuccess).toFixed(1) + "% used successfully"];
        };

        this.init = function (format, data) {
            var labelElement = $(selector(format, "text")),
                labelOffset = labelElement.offset(),
                scrollOffset = {top:labelElement.scrollTop(), left:labelElement.scrollLeft()},
                hoverElement = $(HOVER_SELECTOR);

            var formatName = $(labelElement).text(),
                details = hoverDetailsText(data),
                offset = {top:labelOffset.top + scrollOffset.top - TOP_OFFSET, left:labelOffset.left + scrollOffset.left - LEFT_OFFSET};


            hoverElement.css({top:0, left:0});
            hoverElement.offset(offset);
            hoverElement.data('format', format)
            hoverElement.find('.format').text(formatName);
            hoverElement.find('.details').html(details.join("<br />"));

            hoverElement.fadeIn(100);
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

        var format = d3.select(this).attr('data-format'),
            data = d3.select(this).data();

        $.each($(notSelector(format, 'circle.format')), function(){
            var overlay = $(this).data('overlay-remove');
            if(overlay){
                overlay();
            }
        });

        var hoverBox = new HoverBox();
        hoverBox.init(format, data);

        var circleOverlay = new CircleOverlay();
        circleOverlay.init(format);
        $(selector(format, 'circle')).data('overlay-remove', circleOverlay.destroy);
    };

    var OUT_DELAY = 200;

    var onHoverOut = function () {
        d3.event.stopPropagation();
        var self = this;
        setTimeout(function () {
            var format = $(self).data('format');
            var circle = $(selector(format, "circle"));
            var hoverBox = $(HOVER_SELECTOR);
            if (!circle.is(":hover") && !hoverBox.is(":hover")) {
                if(hoverBox.data('format') === format){
                    hoverBox.fadeOut(100);
                }
                if(circle.data('overlay-remove')){
                    circle.data('overlay-remove')();
                }
            }
        }, OUT_DELAY);
    };

    return {
        onHover:onHover,
        onHoverOut:onHoverOut
    }
}();

setTimeout(function () {
    $('svg:text[data-format=benefits]').trigger('mouseover');
}, 500);