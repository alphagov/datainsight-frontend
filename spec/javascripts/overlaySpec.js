describe("hover overlays", function () {
    
    describe("Callout Box", function () {
        var CalloutBox = GOVUK.Insights.overlay.CalloutBox; 
        var aDiv = $('<div id="test-div"></div>');
        
        beforeEach(function () {
            aDiv.clone().appendTo('body');
        });
        
        afterEach(function () {
            $('#test-div').remove();
        });
        
        it("should place a div on the page when created", function () {
            expect($('#test-div').find('div').length).toBe(0);
            
            var theBox = {
              xPos:15,
              yPos:45,
              parent:'#test-div',
              title:'test',
              rowData: [{left:'foo',right:'bar'}]
            };
            
            var box = new CalloutBox(theBox);
            
            expect($('#test-div').find('.format-success-hover').length).toBe(1);
        });
        
        it("should position the div at the x and y positions specified", function () {
            var theBox = {
              xPos:15,
              yPos:45,
              parent:'#test-div',
              title:'test',
              rowData: [{left:'foo',right:'bar'}]
            };
            var box = new CalloutBox(theBox);
            expect($('#test-div div').attr('style')).toBe("left: 15px; top: 45px; ");
        });
        
        it("should set the title", function () {
            var theBox = {
              xPos:15,
              yPos:45,
              parent:'#test-div',
              title:'test',
              rowData: [{left:'foo',right:'bar'}]
            };
            
            var box = new CalloutBox(theBox);
            
            expect($('.format').text()).toBe('test');
        });
        
        it("should set the description", function () {
            var theBox = {
              xPos:15,
              yPos:45,
              parent:'#test-div',
              title:'test',
              rowData: [{left:'foo',right:'bar'}]
            };
            
            var box = new CalloutBox(theBox);
            
            expect($('.details-left').text()).toBe('foo');
            expect($('.details-right').text()).toBe('bar');
        });
    });
});