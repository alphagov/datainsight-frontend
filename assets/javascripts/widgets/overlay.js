var GOVUK = GOVUK || {};
GOVUK.Insights= GOVUK.Insights || {};

GOVUK.Insights.overlay = function () {
    function CalloutBox(boxInfo) {
        var htmlTemplate = '<div class="callout-box"><div class="format"/><div class="details"><div class="details-left" /><div class="details-right" /></div></div>',
            element = undefined,
            self = this;
        if (boxInfo.destroyer === undefined) {
            boxInfo.destroyer = new GOVUK.Insights.destroyer([self], boxInfo.closeDelay);
        }
        
        var setGeometryCss = function () {
            if (boxInfo.width) element.width(boxInfo.width);
            if (boxInfo.height) element.height(boxInfo.height);
            if (boxInfo.xPos) element.css({left: boxInfo.xPos});
            if (boxInfo.yPos) element.css({top: boxInfo.yPos});  
        };
        
        self.draw = function () {
            $('.callout-box').remove();
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

            element.on('mouseover', boxInfo.destroyer.cancelClose);
            element.on('mouseout', boxInfo.destroyer.close);
            element.appendTo(boxInfo.parent);
        };

        self.close = function () {
            boxInfo.destroyer.close();
        };

        self.destroy = function () {
            element.remove();
        };

        // on construction
        self.draw();
    };
    
    return {
        CalloutBox: CalloutBox
    };
}();

GOVUK.Insights.destroyer = function (components, closeDelay, postDestroy) {
    var canClose = true,
        self = this;

    destroy = function () {
        if (canClose) {
            components.forEach(function (component) {
                component.destroy();
            });
            if (postDestroy) {
                postDestroy();
            }
            canClose = false;
        }
    };

    self.close = function () {
        canClose = true;
        setTimeout(destroy, closeDelay);
    };

    self.cancelClose = function () {
        canClose = false;
    };
}
