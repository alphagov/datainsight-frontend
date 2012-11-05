var GOVUK = GOVUK || {};
GOVUK.Insights= GOVUK.Insights || {};

GOVUK.Insights.overlay = function () {
    function CalloutBox(boxInfo) {
        var htmlTemplate = '<div class="format-success-hover"><div class="format"/><div class="details"><div class="details-left" /><div class="details-right" /></div></div>',
            element = undefined,
            timeout = undefined;
        
        
        var setGeometryCss = function () {
            if (boxInfo.width) element.width(boxInfo.width);
            if (boxInfo.height) element.height(boxInfo.height);
            if (boxInfo.xPos) element.css({left: boxInfo.xPos});
            if (boxInfo.yPos) element.css({top: boxInfo.yPos});  
        };
        
        this.draw = function () {
            $('.format-success-hover').remove();
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
        
        unDraw = function () {
            element.remove();
        };
        
        this.close = function () {
            timeout = setTimeout(unDraw, boxInfo.closeDelay);
        };
        
        this.cancelClose = function () {
            window.clearTimeout(timeout);
            timeout = undefined;
        };
        
        // on construction
        this.draw();
    };
    
    return {
        CalloutBox: CalloutBox
    };
}();