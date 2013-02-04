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
                content:'test'
            };

            var box = new CalloutBox(theBox);

            expect($('#test-div').find('.callout-box').length).toBe(1);
        });

        it("should position the div at the x and y positions specified", function () {
            var theBox = {
                xPos:15,
                yPos:45,
                parent:'#test-div',
                content:'test'
            };
            var box = new CalloutBox(theBox);
            expect($('#test-div div').attr('style')).toMatch(/left: *15px;/);
            expect($('#test-div div').attr('style')).toMatch(/top: *45px;/);
        });

        it("should set the content", function () {
            var theBox = {
                xPos:15,
                yPos:45,
                parent:'#test-div',
                content:'test'
            };

            var box = new CalloutBox(theBox);

            expect($('.callout-box').text()).toBe('test');
        });

        it("should add a css class to the top level element", function () {
            var theBox = {
                xPos:15,
                yPos:45,
                parent:'#test-div',
                content: 'test',
                boxClass:"my-class"
            };

            var box = new CalloutBox(theBox);

            expect($('.callout-box').hasClass("my-class")).toBeTruthy();
        });
        
        describe("touch behaviour", function() {
            
            var params, oneSpy, offSpy;
            beforeEach(function() {
                params = {
                    xPos:15,
                    yPos:45,
                    parent:'#test-div',
                    content:'test',
                    callback: jasmine.createSpy()
                };

                // spy on jQuery
                oneSpy = jasmine.createSpy();
                offSpy = jasmine.createSpy();
                window.$ = jasmine.createSpy().andReturn({
                    css: jasmine.createSpy(),
                    append: jasmine.createSpy(),
                    appendTo: jasmine.createSpy(),
                    remove: jasmine.createSpy(),
                    on: jasmine.createSpy(),
                    one: oneSpy,
                    off: offSpy
                });
                
            });
            
            afterEach(function() {
                // restore jQuery
                window.$ = window.jQuery;
            });
            
            it("should add a one-off touchend handler to the document", function() {
                var box = new CalloutBox(params);

                expect(window.$).toHaveBeenCalledWith('html');
                expect(oneSpy).toHaveBeenCalledWith(
                    'touchend', box.htmlTouchHandler
                );
                expect(offSpy).not.toHaveBeenCalled();
            });
            
            it("should remove the touchend handler from the document", function() {
                var box = new CalloutBox(params);
                box.close()

                expect(offSpy).toHaveBeenCalledWith(
                    'touchend', box.htmlTouchHandler
                );
            });
            
            it("should call the callback with 'touch' option on document touchend", function() {
                var box = new CalloutBox(params);
                
                box.htmlTouchHandler();
                expect(params.callback).toHaveBeenCalledWith(true);
            });
        });
        
    });

    describe("Callout content", function () {
        it("should set the title", function () {
            var box = GOVUK.Insights.overlay.calloutContent("the expected title", []);

            expect(box.first().hasClass("data-point-label")).toBeTruthy();
            expect(box.first().text()).toBe('the expected title');
        });

        it("should set the description", function () {
            var rowData = [{left:'foo',right:'bar'}]

            var box = GOVUK.Insights.overlay.calloutContent("any title", rowData);

            expect(box.find('.details-left').text()).toBe('foo');
            expect(box.find('.details-right').text()).toBe('bar');
        });

        it("should set multiple rows of description", function () {
            var rowData = [
                {left:'left-1',right:'right-1'},
                {left:'left-2',right:'right-2'}
            ]

            var box = GOVUK.Insights.overlay.calloutContent("any title", rowData);

            expect(box.find('.details-left').html()).toBe('left-1<br>left-2');
            expect(box.find('.details-right').html()).toBe('right-1<br>right-2');
        });
    });
});