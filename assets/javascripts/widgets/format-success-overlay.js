var GOVUK = GOVUK || {};

GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.formatSuccessOverlay = function () {

    var currentHoverEffects = [];

    var svgTranslation = function (x, y) {
        return "translate(" + x + "," + y + ")";
    };


    function HoverBox() {
        var group;

        var getBox = function (element) {
            return element.node().getBBox();
        }

        var hoverDetailsText = function (data) {
            return [ (data[0].total / 1000).toFixed(1) + "k times used" ,
                (data[0].percentageOfSuccess).toFixed(1) + "% used successfully"];
        };

        this.destroy = function () {
            group.remove();
        };

        this.init = function (labelElement) {
            var labelBox = labelElement.node().getBBox(),
                width = 100, height = 100, xOffset = 5, yOffset = 3;

            var text = hoverDetailsText(labelElement.data());

            group = d3.selectAll('#format-success-graph')
                .append('svg:g')
                .attr('transform', svgTranslation(labelBox.x - xOffset, labelBox.y - yOffset));

            group.append('svg:text')
                .attr("id", 'text-insert-before-something-very-long')
                .text(labelElement.text())
                .style('font-weight', 600)
                .attr('y',18)
                .attr('x',xOffset);

            group.append('svg:text')
                 .text(text[0])
                 .attr('y',35)
                 .attr('x',xOffset);

            group.append('svg:text')
                 .text(text[1])
                 .attr('y',50)
                 .attr('x',xOffset);


            var groupBox = group.node().getBBox();


            group.insert('svg:rect', '#text-insert-before-something-very-long')
                .attr('width', groupBox.width + xOffset * 2)
                .attr('height', groupBox.height + yOffset * 2)
                .attr('fill', new GOVUK.Insights.colors('rgb(237, 236, 237)').asCSS())
                .attr('fill-opacity', 1)
                .attr('stroke', new GOVUK.Insights.colors('rgb(222, 223, 222)').asCSS())
                .attr('stroke-width', 2)
                .attr('rx', 5)
                .attr('ry', 5);

        };
    }

    ;

    function CircleOverlay() {
        var circle = {};

        this.destroy = function () {
            circle.classed('hover', false);
            circle.style('stroke', "#ffffff");
        }

        this.init = function (elementToHighlight) {
            circle = elementToHighlight;
            circle.classed('hover', true);
            var fillColour = new GOVUK.Insights.colors(circle.attr('fill'));
            circle.style('stroke', fillColour.multiplyWithSelf().asCSS());
        }
    }


    var onHover = function () {
        var hoverBox = new HoverBox();
        var format = d3.select(this).attr('data-format')
        hoverBox.init(d3.select("text[data-format=" + format + "]"));

        currentHoverEffects.push(hoverBox);

        var circleOverlay = new CircleOverlay();
        circleOverlay.init(d3.select(this));

        currentHoverEffects.push(circleOverlay);

//        var element = d3.select(this);
//        var format = element.attr('data-format');
//        var fillColour = new GOVUK.Insights.colors(element.attr('fill'));
//        element.style('stroke', fillColour.multiplyWithSelf().asCSS());
//
//        element.style('stroke-width', 3);
//        var label = d3.selectAll("text[data-format=" + format + "]");
//        label.attr('class', 'hover');
//
//        var labelRect = document.getElementById(label.attr('id')).getBBox();
//        var details = d3.select('#format-success-graph')
//            .append('svg:text')
//            .attr('id', 'details-hover')
//            .attr("y", labelRect.y + labelRect.height + 10)
//            .attr("x", labelRect.x)
//            .attr('class', 'hover-element');
//        var detailsText = (hoverDetailsText(label.data()));
//
//        details.append('svg:tspan').attr('y', labelRect.y + 30).attr('x', labelRect.x).text(detailsText[0]);
//        details.append('svg:tspan').attr('y', labelRect.y + 46).attr('x', labelRect.x).text(detailsText[1]);
//
//        var detailsRect = document.getElementById(details.attr('id')).getBBox();
//
//        d3.select('#format-success-graph')
//            .insert("svg:rect", "text[data-format=" + format + "]")
//            .attr('id', 'hover-box')
//            .attr('data-format', format)
//            .attr("height", labelRect.height + detailsRect.height + 6)
//            .attr("width", Math.max(labelRect.width, detailsRect.width) + 10)
//            .attr("y", labelRect.y - 3)
//            .attr("ry", 5)
//            .attr("x", labelRect.x - 5)
//            .attr("rx", 5)
//            .attr("class", "hover-box hover-element");

    };

    var onHoverOut = function () {
        for (var i = 0; i < currentHoverEffects.length; i++) {
            currentHoverEffects[i].destroy();
        }
        currentHoverEffects = [];
//        d3.select(this).style('stroke', '#ffffff');
//        d3.select(this).style('stroke-width', 2);
//        d3.selectAll('.hover-element').remove();
//        d3.selectAll('.hover').attr('class', '');
    };

    return {
        onHover:onHover,
        onHoverOut:onHoverOut
    }
}();

setTimeout(function () {
    $('svg:text[data-format=benefits]').trigger('mouseover');
}, 500);