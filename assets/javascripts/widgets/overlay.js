var GOVUK = GOVUK || {};
GOVUK.Insights= GOVUK.Insights || {};

GOVUK.Insights.overlay = function () {
    function CalloutBox(boxInfo) {
        var htmlTemplate = '<div class="format-success-hover" style="left:@x@px; top:@y@px"><div class="format"/><div class="details"/></div>',
            element = undefined,
            timeout = undefined;
        
        this.draw = function () {
            $('.format-success-hover').remove();
            var html = htmlTemplate.replace('@x@',boxInfo.xPos).replace('@y@',boxInfo.yPos);
            element = $(html);
            element.find('.format').text(boxInfo.title);
            element.find('.details').html(boxInfo.description);
            element.on('mouseover', this.cancelClose);
            element.on('mouseout', this.close);
            element.appendTo(boxInfo.parent);
        };
        
        unDraw = function () {
            element.remove();
        };
        
        this.close = function () {
            timeout = setTimeout(unDraw,300);
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