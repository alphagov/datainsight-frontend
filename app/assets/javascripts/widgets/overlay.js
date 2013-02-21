var GOVUK = GOVUK || {};
GOVUK.Insights= GOVUK.Insights || {};

GOVUK.Insights.overlay = function () {
    var overlays = [];
    var contentTemplate = '<div><div class="data-point-label"/><div class="details"><div class="details-left" /><div class="details-right" /></div></div>';

    function applySimplePositioning(boxInfo, element) {
        if (boxInfo.xPos !== undefined) element.css({left:boxInfo.xPos});
        if (boxInfo.yPos !== undefined) element.css({top:boxInfo.yPos});
        if (boxInfo.bottom !== undefined) element.css({bottom:boxInfo.bottom});
    }

    function applyPivotPositioning(boxInfo, element) {
        var pos = GOVUK.Insights.point(
            boxInfo.xPos || 0,
            boxInfo.yPos || 0
        );

        pos = this.applyPivot(pos, boxInfo.pivot, $(boxInfo.parent));

        element.css({
            left:pos.x(),
            top:pos.y()
        });
    }

    function CalloutBox(boxInfo) {
        var htmlTemplate = '<div class="callout-box"></div>',
            element = undefined,
            timeout = undefined,
            shouldUnDraw = false;

        var content = boxInfo.content || calloutContent(boxInfo.title, boxInfo.rowData);

        this.draw = function () {
            overlays.splice(0, overlays.length - 1).forEach(
                function (unDraw) {
                    unDraw();
                }
            );
            element = this.element = $(htmlTemplate);
            
            if (boxInfo.boxClass) {
                element.addClass(boxInfo.boxClass);
            }
            
            element.append(content);

            if (boxInfo.width !== undefined)  element.width(boxInfo.width);
            if (boxInfo.height !== undefined) element.height(boxInfo.height);

            if (boxInfo.pivot) {
                applyPivotPositioning.call(this, boxInfo, element);
            } else {
                applySimplePositioning(boxInfo, element);
            }

            element.on('mouseover', this.cancelClose);
            element.on('mouseout', this.close);
            element.on('touchend', this.close);
            $('html').one('touchend', this.htmlTouchHandler);

            element.appendTo(boxInfo.parent);
        };
        
        var unDraw = function (onTouch) {
            if (shouldUnDraw) {
                if (boxInfo.callback) boxInfo.callback(onTouch);
                element.remove();
                shouldUnDraw = false;
            }
        };
        overlays.push(unDraw);
        
        this.htmlTouchHandler = function (e) {
            shouldUnDraw = true;
            unDraw(true);
            return false;
        };
        
        this.close = function () {
            $('html').off('touchend', this.htmlTouchHandler);
            shouldUnDraw = true;
            timeout = setTimeout(unDraw, boxInfo.closeDelay);
            return false;
        };

        this.cancelClose = function () {
            shouldUnDraw = false;
            window.clearTimeout(timeout);
            timeout = undefined;
        };

        // on construction
        this.draw();
    }
    
    /**
     * "Pivoting" aligns the Callout in relation to an element. Commonly, this
     * is the element that caused the Callout to appear. The "pivot point" is
     * the coordinate to which the callout is aligned to. The
     * "pivot direction" is where this point is on the Callout.
     * 
     * @param {Point} basePos Starting position for the Callout
     * @param {Object} pivot Information for the pivoting process
     * @param pivot.horizontal Horizontal position of the pivot point on the callout
     * @param pivot.vertical Vertical position of the pivot point on the callout
     * @param [pivot.xOffset=0] Additional horizontal offset to be applied to the pivot point
     * @param [pivot.yOffset=0] Additional vertical offset to be applied to the pivot point
     * @param {Boolean} [pivot.constrainToBounds=false] Reverse direction if the Callout overflows the "bounds" element
     * @param {jQuery} [bounds=null] Element whose bounding box the Callout should not overflow
     */
    CalloutBox.prototype.applyPivot = function (basePos, pivot, bounds) {
        
        var el = this.element;
        
        pivot.xOffset = pivot.xOffset || 0;
        pivot.yOffset = pivot.yOffset || 0;
        var horizontal = pivot.horizontal;
        var vertical = pivot.vertical;
        
        // first, move into direction that was requested
        var pivotCorrection = this.offsetFromTopLeft(horizontal, vertical);
        
        var pos = GOVUK.Insights.point(
            basePos.x() + pivot.xOffset - pivotCorrection.x(),
            basePos.y() + pivot.yOffset - pivotCorrection.y()
        );

        if (pivot.constrainToBounds) {
            // reverse directions if there are overlaps
            var overlap = false;
            if (pos.x() < 0 || pos.x() + el.width() > bounds.width()) {
                horizontal = this.reversePositionToFraction(horizontal);
                pivot.xOffset *= -1;
                overlap = true;
            }
            if (pos.y() < 0 || pos.y() + el.height() > bounds.height()) {
                vertical = this.reversePositionToFraction(vertical);
                pivot.yOffset *= -1;
                overlap = true;
            }

            if (overlap) {
                pivotCorrection = this.offsetFromTopLeft(horizontal, vertical);
                pos = GOVUK.Insights.point(
                    basePos.x() + pivot.xOffset - pivotCorrection.x(),
                    basePos.y() + pivot.yOffset - pivotCorrection.y()
                );
            }
        }
        
        return pos;
    };
    
    CalloutBox.prototype.reversePositionToFraction = function (pos) {
        return 1 - this.positionToFraction(pos);
    };

    CalloutBox.prototype.positionToFraction = function (pos) {
        if (typeof pos == 'number') {
            return GOVUK.Insights.clamp(pos, 0, 1);
        }
        
        if (typeof pos == 'string') {
            // percentage value
            var matches = pos.match(/(-?\d+)\%/);
            if (matches) {
                var fraction = parseFloat(matches[1]) / 100;
                return GOVUK.Insights.clamp(fraction, 0, 1)
            }
            
            // match logical values
            var fraction = {
                top: 0,
                left: 0,
                centre: .5,
                center: .5,
                middle: .5,
                bottom: 1,
                right: 1
            }[pos];
            
            return (typeof fraction == 'undefined') ? null : fraction;
        }
        
        return null;
    };
    
    CalloutBox.prototype.offsetFromTopLeft = function (horizontal, vertical) {
        var el = this.element;
        var width = el.width();
        var height = el.height();
        return GOVUK.Insights.point(
            width * this.positionToFraction(horizontal),
            height * this.positionToFraction(vertical)
        );
    };
    
    function calloutContent(title, rowData) {
        var contentElement = $(contentTemplate);

        contentElement.find('.data-point-label').html(title);
        for (var i = 0; i < rowData.length; i++) {
            contentElement.find('.details-left').append(rowData[i].left);
            contentElement.find('.details-right').append(rowData[i].right);
            if (i !== rowData.length - 1) {
                contentElement.find('.details-left').append("<br>");
                contentElement.find('.details-right').append("<br>");
            }
        }

        return contentElement.children();
    }
    
    return {
        CalloutBox: CalloutBox,
        calloutContent: calloutContent
    };
}();