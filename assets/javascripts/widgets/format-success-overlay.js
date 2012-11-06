var GOVUK = GOVUK || {};

GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.formatSuccessOverlay = function () {

    var currentEffects = {};
    var OUT_DELAY = 200;

    var selector = function (format, elementType) {
        return elementType + '[data-format=' + format + ']';
    };

    function HoverBox(format, data, overlay, destroyer) {
        var Callout = GOVUK.Insights.overlay.CalloutBox;
        var TOP_OFFSET = 2, LEFT_OFFSET = 7;

        var box = undefined;

        var determinePosition = function (labelElement, boxHeight, boxWidth) {
            var labelPosition = labelElement.position(),
                quadrant = labelElement.attr('data-quadrant'),
                position = {
                    top:labelPosition.top - TOP_OFFSET,
                    left:labelPosition.left - LEFT_OFFSET,
                    bottom: labelPosition.top - boxHeight + labelElement.height() + TOP_OFFSET,
                    right: labelPosition.left - boxWidth + labelElement.width() + LEFT_OFFSET
                };
            if (quadrant >= 0 && quadrant < 1) {
                return {
                    yPos:position.top,
                    xPos:position.left
                };
            } else if (quadrant >= 1 && quadrant < 2) {
                return {
                    yPos:position.top,
                    xPos:position.right
                };
            } else if (quadrant >= -1 && quadrant < 0) {
                return {
                    yPos:position.bottom,
                    xPos:position.left
                };
            } else if (quadrant >= -2 && quadrant < -1) {
                return {
                    yPos:position.bottom,
                    xPos:position.right
                };
            } else {
                return {
                    yPos:position.top,
                    xPos:position.left
                }
            }
        };

        this.init = function () {
            var width = 180,
                height = 66,
                labelElement = $(selector(format, "text"));
                position = determinePosition(labelElement, height, width);

            var formatName = labelElement.text();
                calloutInfo = {
                    xPos: position.xPos,
                    yPos: position.yPos,
                    parent: "#format-success",
                    title: formatName,
                    rowData: [
                        { left: GOVUK.Insights.formatNumericLabel(data[0].total), right: "times used" },
                        { left: (data[0].percentageOfSuccess).toFixed(0) + "%", right: "used successfully" }
                    ],
                    width: width,
                    height: height,
                    destroyer: destroyer
                };
            box = new Callout(calloutInfo);
        };

        this.destroy = function () {
            box.destroy();
        };
    }

    function CircleOverlay(format) {
        var circle = {};

        this.destroy = function () {
            circle.classed('hover', false);
            circle.style('stroke', "#ffffff");
        };

        this.init = function () {
            circle = d3.select(selector(format, "circle"));
            circle.classed('hover', true);
            var fillColour = new GOVUK.Insights.colors(circle.attr('fill'));
            circle.style('stroke', fillColour.multiplyWithSelf().asCSS());
            // Append the circle to its parent to put it to the front
            circle.node().parentNode.appendChild(circle.node());
        }
    }

    function Overlay(format, data) {
        var components = [],
            present = false,
            destroyer = new GOVUK.Insights.destroyer([], 0);

        this.format = format;

        this.init = function () {
            if (!present) {
                destroyer = new GOVUK.Insights.destroyer(components, 100,
                    function () {
                        components = [];
                        present = false;
                    });
                var box = new HoverBox(format, data, this, destroyer);
                components.push(box);
                var circle = new CircleOverlay(format);
                components.push(circle);

                components.forEach(function (component) {
                    component.init();
                });
                present = true;
            }
        };

        this.destroy = function () {
            if (present) {
                destroyer.close();
            }
        };

        this.cancelDestroy = function () {
            destroyer.cancelClose();
        };
    }


    var resetOverlays = function (format) {
        for (var _format in currentEffects) {
            if (currentEffects.hasOwnProperty(_format)) {
                if (_format !== format) {
                    currentEffects[_format].destroy();
                } else {
                    currentEffects[_format].cancelDestroy();
                }
            }
        }
    };

    var onHover = function () {
        d3.event.stopPropagation();

        var format = d3.select(this).attr('data-format'),
            data = d3.select(this).data();

        resetOverlays(format);

        if (!currentEffects[format]) {
            currentEffects[format] = new Overlay(format, data);
        }
        currentEffects[format].init();
    };


    var onHoverOut = function () {
        d3.event.stopPropagation();

        var format = d3.select(this).attr('data-format');

        if (currentEffects[format]) {
            currentEffects[format].destroy();
        }
    };

    return {
        onHover:onHover,
        onHoverOut:onHoverOut
    };
}();
