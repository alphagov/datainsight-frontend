var GOVUK = GOVUK || {};

GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.formatSuccessOverlay = function () {

    var currentHoverEffects = [];

    var svgTranslation = function (x, y) {
        return "translate(" + x + "," + y + ")";
    };


    function HoverBox() {
        var group;

        var HOVER_SELECTOR='#format-success-hover';

        var hoverDetailsText = function (data) {
            return [ (data[0].total / 1000).toFixed(1) + "k times used" ,
                (data[0].percentageOfSuccess).toFixed(1) + "% used successfully"];
        };

        this.destroy = function () {
            $(HOVER_SELECTOR).hide(0, function () {
                $(HOVER_SELECTOR).css({top:0, left:0});
            });
        };

        this.init = function (_label, data) {

            var labelElement = $(_label),
                labelOffset = labelElement.offset(),
                scrollOffset = {top:labelElement.scrollTop(), left:labelElement.scrollLeft()},
                xOffset = 5, yOffset = 2,
                hoverElement = $(HOVER_SELECTOR);

            var format = $(labelElement).text(),
                details = hoverDetailsText(data),
                offset = {top:labelOffset.top + scrollOffset.top - yOffset, left:labelOffset.left + scrollOffset.left - xOffset};


            hoverElement.offset(offset);
            hoverElement.find('.format').text(format);
            hoverElement.find('.details').html(details.join("<br />"));

            hoverElement.show(0);
        };
    }
    function CircleOverlay() {
        var circle = {};

        this.destroy = function () {
            circle.classed('hover', false);
            circle.style('stroke', "#ffffff");
        }

        this.init = function (_circle) {
            circle = d3.select(_circle);
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
            label = d3.select("text[data-format=" + format + "]"),
            circle = d3.select("circle[data-format=" + format + "]"),
            data = d3.select(this).data();


        var hoverBox = new HoverBox();
        hoverBox.init(label.node(), data);
        currentHoverEffects.push(hoverBox);

        var circleOverlay = new CircleOverlay();
        circleOverlay.init(circle.node());
        currentHoverEffects.push(circleOverlay);
    };

    var onHoverOut = function () {
        for (var i = 0; i < currentHoverEffects.length; i++) {
            currentHoverEffects[i].destroy();
        }
        currentHoverEffects = [];
    };

    return {
        onHover:onHover,
        onHoverOut:onHoverOut
    }
}();

setTimeout(function () {
    $('svg:text[data-format=benefits]').trigger('mouseover');
}, 500);