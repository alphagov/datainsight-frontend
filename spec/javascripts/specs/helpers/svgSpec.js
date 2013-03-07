describe("SVG helpers", function() {
    var container;
    beforeEach(function() {
        container = $('<div id="jasmine-playground"></div>').appendTo($('body'));
    });
    
    afterEach(function() {
        container.remove();
    });
    
    describe("translate", function() {
        it("should generate a translate directive", function() {
            expect(GOVUK.Insights.svg.translate(0, 0)).toEqual("translate(0,0)");
            expect(GOVUK.Insights.svg.translate(13.4, -67.25)).toEqual("translate(13.4,-67.25)");
        });
    });
    
    describe("getJQueryReference", function() {
        it("converts a d3 selection into a jQuery reference", function() {
            var selection = d3.select(container);
            var el = GOVUK.Insights.svg.getJQueryReference(selection)
            expect(el instanceof jQuery).toBe(true);
            expect(el.length).toEqual(1);
            expect(el.prop('id')).toEqual('jasmine-playground');
        });
        
        it("converts a native DOM node into a jQuery reference", function() {
            var node = document.getElementById('jasmine-playground');
            var el = GOVUK.Insights.svg.getJQueryReference(node)
            expect(el instanceof jQuery).toBe(true);
            expect(el.length).toEqual(1);
            expect(el.prop('id')).toEqual('jasmine-playground');
        });
        
        it("accepts a jQuery reference", function() {
            var el = GOVUK.Insights.svg.getJQueryReference(container)
            expect(el instanceof jQuery).toBe(true);
            expect(el.length).toEqual(1);
            expect(el.prop('id')).toEqual('jasmine-playground');
        });
    });
    
    describe("scaleFactor", function() {
        var svg;
        beforeEach(function() {
            svg = $('<svg width="100%" height="100%" viewBox="0 0 400 300"></svg>');
            svg.css('display', 'block');
            svg.appendTo(container);
        });
        
        it("calculates scale factor for unscaled SVG element", function() {
            container.width(400);
            expect(GOVUK.Insights.svg.scaleFactor(svg)).toEqual(1);
        });
        
        it("calculates scale factor for scaled SVG element", function() {
            container.width(200);
            expect(GOVUK.Insights.svg.scaleFactor(svg)).toEqual(.5);
        });
    });
    
    describe("adjustToParentWidth", function() {
        var svg;
        beforeEach(function() {
            svg = $('<svg width="100%" height="100%" viewBox="0 0 400 300"></svg>');
            svg.css('display', 'block');
            svg.appendTo(container);
        });
        
        it("does not resize when no resize is needed", function() {
            container.width(400);
            GOVUK.Insights.svg.adjustToParentWidth(svg);
            expect(svg.parent().height()).toEqual(300);
        });
        
        it("resizes according to aspect ratio", function() {
            container.width(200);
            GOVUK.Insights.svg.adjustToParentWidth(svg);
            expect(svg.parent().height()).toEqual(150);
        });
    });
});
