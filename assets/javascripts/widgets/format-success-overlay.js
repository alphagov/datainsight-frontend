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
            return [ (data[0].total / 1000).toFixed(1) + "k times used" ,
                (data[0].percentageOfSuccess).toFixed(1) + "% used successfully"];
        };

        this.init = function () {
            var labelElement = $(selector(format, "text")),
                labelOffset = labelElement.offset(),
                scrollOffset = {top:labelElement.scrollTop(), left:labelElement.scrollLeft()};

            box = $('<div class="format-success-hover" data-format="' + format + '" style="display: none;"><div class="format"/><div class="details"/></div>');
            box.on('mouseover', function(event){
                event.stopPropagation();
                overlay.cancelDestroy();
            });
            box.on('mouseleave', function(event){
                event.stopPropagation();
                overlay.destroyAfterDelay();
            });

            var formatName = $(labelElement).text(),
                details = hoverDetailsText(data),
                offset = {top:labelOffset.top + scrollOffset.top - TOP_OFFSET, left:labelOffset.left + scrollOffset.left - LEFT_OFFSET};

            box.offset(offset);
            box.find('.format').text(formatName);
            box.find('.details').html(details.join("<br />"));

            $(document.body).append(box);
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

        currentEffects[format].destroyAfterDelay();
    };

    return {
        onHover:onHover,
        onHoverOut:onHoverOut
    }
}();