var GOVUK = GOVUK || {};
GOVUK.Insights= GOVUK.Insights || {};

GOVUK.Insights.overlay = function () {
    var overlays = [];

    function CalloutBox(boxInfo) {
        var htmlTemplate = '<div class="callout-box"><div class="format"/><div class="details"><div class="details-left" /><div class="details-right" /></div></div>',
            element = undefined,
            timeout = undefined,
            defaults = {
                xPos: 0,
                yPos: 0
            },
            shouldUnDraw = false;
        
        var setGeometryCss = function () {
            if (boxInfo.width !== undefined) element.width(boxInfo.width);
            if (boxInfo.height !== undefined) element.height(boxInfo.height);
            (boxInfo.xPos !== undefined) ? element.css({left: boxInfo.xPos}) : element.css({left: defaults.xPos});
            (boxInfo.yPos !== undefined) ? element.css({top: boxInfo.yPos}) : element.css({top: defaults.xPos});
        };
        
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
            element.find('.format').text(boxInfo.title);

            for(var i = 0; i < boxInfo.rowData.length; i++) {
                element.find('.details-left').append(boxInfo.rowData[i].left);
                element.find('.details-right').append(boxInfo.rowData[i].right);
                if (i !== boxInfo.rowData.length - 1) {
                    element.find('.details-left').append("<br>");
                    element.find('.details-right').append("<br>");
                }
            }

            if (boxInfo.closeDelay > 0) {
                element.on('mouseover', this.cancelClose);
                element.on('mouseout', this.close);
            }
            element.appendTo(boxInfo.parent);
        };
        
        var unDraw = function () {
            if (shouldUnDraw) {
                if (boxInfo.callback) boxInfo.callback();
                element.remove();
                shouldUnDraw = false;
            }
        };
        overlays.push(unDraw);
        
        this.close = function () {
            shouldUnDraw = true;
            timeout = setTimeout(unDraw, boxInfo.closeDelay);
        };

        this.cancelClose = function () {
            shouldUnDraw = false;
            window.clearTimeout(timeout);
            timeout = undefined;
        };

        // on construction
        this.draw();
    }
    
    return {
        CalloutBox: CalloutBox
    };
}();