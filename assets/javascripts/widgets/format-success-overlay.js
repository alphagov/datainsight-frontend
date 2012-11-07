var GOVUK = GOVUK || {};

GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.formatSuccessOverlay = function () {

    var currentEffects = {};
    var OUT_DELAY = 200;

    var selector = function (format, elementType) {
        return elementType + '[data-format=' + format + ']';
    };

    function HoverBox(format, data, overlay) {
        var TOP_OFFSET = 2, LEFT_OFFSET = 7;

        var box = undefined;


        var hoverDetailsText = function (data) {
            return [ GOVUK.Insights.formatNumericLabel(data[0].total) + " times used" ,
                (data[0].percentageOfSuccess).toFixed(0) + "% used successfully"];
        };

        var determinePosition = function (labelElement) {
            var labelOffset = labelElement.offset(),
                scrollOffset = {top:labelElement.scrollTop(), left:labelElement.scrollLeft()},
                quadrant = labelElement.attr('data-quadrant'),
                position = {
                    top:labelOffset.top + scrollOffset.top - TOP_OFFSET,
                    left:labelOffset.left + scrollOffset.left - LEFT_OFFSET,
                    bottom: labelOffset.top + scrollOffset.top  - box.height() + labelElement.height() + TOP_OFFSET,
                    right: labelOffset.left + scrollOffset.left - box.width() + labelElement.width() + LEFT_OFFSET
                };

            if (quadrant >= 0 && quadrant < 1) {
                return {
                    top:position.top,
                    left:position.left
                };
            } else if (quadrant >= 1 && quadrant < 2) {
                return {
                    top:position.top,
                    left:position.right
                };
            } else if (quadrant >= -1 && quadrant < 0) {
                return {
                    top:position.bottom,
                    left:position.left
                };
            } else if (quadrant >= -2 && quadrant < -1) {
                return {
                    top:position.bottom,
                    left:position.right
                };
            } else {
                return {
                    top:position.top,
                    left:position.left
                }
            }
        }

        this.init = function () {
            var labelElement = $(selector(format, "text"));

            box = $('<div class="callout-box" data-format="' + format + '" style="display: none;"><div class="format"/><div class="details"/></div>');
            box.on('mouseover', function (event) {
                event.stopPropagation();
                overlay.cancelDestroy();
            });
            box.on('mouseleave', function (event) {
                event.stopPropagation();
                overlay.destroyAfterDelay();
            });

            var formatName = labelElement.text(),
                details = hoverDetailsText(data);

            box.find('.format').text(formatName);
            box.find('.details').html(details.join("<br />"));

            $(document.body).append(box);
            var position = determinePosition(labelElement);
            box.css(position);
            box.fadeIn(100);
        };

        this.destroy = function () {
            box.fadeOut(100, function () {
                box.remove();
            });
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
            timeout = undefined,
            present = false,
            self = this;

        this.format = format;

        this.init = function () {
            if (!present) {
                var box = new HoverBox(format, data, this);
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
                components.forEach(function (component) {
                    component.destroy();
                });
                components = [];
                present = false;
            }
        };

        this.destroyAfterDelay = function () {
            timeout = setTimeout(self.destroy, OUT_DELAY);
        };

        this.cancelDestroy = function () {
            if (timeout) {
                window.clearTimeout(timeout);
                timeout = undefined;
            }
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
            currentEffects[format].destroyAfterDelay();
        }
    };

    return {
        onHover:onHover,
        onHoverOut:onHoverOut
    }
}();