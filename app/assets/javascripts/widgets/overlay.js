var GOVUK = GOVUK || {};
GOVUK.Insights= GOVUK.Insights || {};

GOVUK.Insights.overlay = function () {
    var overlays = [];
    var contentTemplate = '<div><div class="data-point-label"/><div class="details"><div class="details-left" /><div class="details-right" /></div></div>';

    function CalloutBox(boxInfo) {
        var htmlTemplate = '<div class="callout-box"></div>',
            element = undefined,
            timeout = undefined,
            shouldUnDraw = false;

        var setGeometryCss = function () {
            if (boxInfo.width !== undefined)  element.width(boxInfo.width);
            if (boxInfo.height !== undefined) element.height(boxInfo.height);
            if (boxInfo.xPos !== undefined)   element.css({left: boxInfo.xPos});
            if (boxInfo.yPos !== undefined)   element.css({top: boxInfo.yPos});
            if (boxInfo.bottom !== undefined) element.css({bottom: boxInfo.bottom});
        };

        var content = boxInfo.content || calloutContent(boxInfo.title, boxInfo.rowData);

        this.draw = function () {
            overlays.splice(0, overlays.length - 1).forEach(
                function (unDraw) {
                    unDraw();
                }
            );
            element = $(htmlTemplate);
            if (boxInfo.boxClass) {
                element.addClass(boxInfo.boxClass);
            }
            setGeometryCss();

            element.on('mouseover', this.cancelClose);
            element.on('mouseout', this.close);
            element.on('touchend', this.close);
            $('html').one('touchend', this.htmlTouchHandler);
            
            element.append(content);

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

    function calloutContent(title, rowData) {
        var contentElement = $(contentTemplate);

        contentElement.find('.data-point-label').text(title);
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