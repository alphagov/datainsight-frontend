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
        
        describe("applyPivot", function() {
            
            var params, box, basePos;
            beforeEach(function() {
                basePos = {
                    x: jasmine.createSpy().andReturn(400),
                    y: jasmine.createSpy().andReturn(400)
                }
                
                params = {
                    content:'test',
                    callback: jasmine.createSpy()
                };
                
                box = new CalloutBox(params);
                box.element = {
                    width: jasmine.createSpy().andReturn(30),
                    height: jasmine.createSpy().andReturn(20)
                };
            });
            
            it("aligns the callout to the bottom left corner", function() {
                var pivot = {
                    horizontal: 'left',
                    vertical: 'bottom'
                };
                var pos = box.applyPivot(basePos, pivot);
                expect(pos.x()).toEqual(400);
                expect(pos.y()).toEqual(380);
            });
            
            it("aligns the callout to the top right corner", function() {
                var pivot = {
                    horizontal: 'right',
                    vertical: 'top'
                };
                var pos = box.applyPivot(basePos, pivot);
                expect(pos.x()).toEqual(370);
                expect(pos.y()).toEqual(400);
            });
            
            it("aligns the callout to the bottom left corner with offset", function() {
                var pivot = {
                    horizontal: 'left',
                    vertical: 'bottom',
                    xOffset: 13,
                    yOffset: 12
                };
                var pos = box.applyPivot(basePos, pivot);
                expect(pos.x()).toEqual(413);
                expect(pos.y()).toEqual(392);
            });
            
            it("aligns the callout to the top right corner with offset", function() {
                var pivot = {
                    horizontal: 'right',
                    vertical: 'top',
                    xOffset: 13,
                    yOffset: 12
                };
                var pos = box.applyPivot(basePos, pivot);
                expect(pos.x()).toEqual(383);
                expect(pos.y()).toEqual(412);
            });
            
            describe("contrain to bounds", function() {
                var pivot;
                beforeEach(function() {
                    pivot = {
                        horizontal: 'left',
                        vertical: 'bottom',
                        xOffset: 13,
                        yOffset: 12,
                        constrainToBounds: true
                    };
                });
                
                it("reverses horizontal direction if it overflows the bounds element", function() {
                    var bounds = {
                        width: jasmine.createSpy().andReturn(442),
                        height: jasmine.createSpy().andReturn(500)
                    };
                    var pos = box.applyPivot(basePos, pivot, bounds);
                    expect(pos.x()).toEqual(357);
                    expect(pos.y()).toEqual(392);
                });

                it("does not reverse horizontal direction if it does not overflow the bounds element", function() {
                    var bounds = {
                        width: jasmine.createSpy().andReturn(443),
                        height: jasmine.createSpy().andReturn(500)
                    };
                    var pos = box.applyPivot(basePos, pivot, bounds);
                    expect(pos.x()).toEqual(413);
                    expect(pos.y()).toEqual(392);
                });

                it("reverses vertical direction if it overflows the bounds element", function() {
                    var bounds = {
                        width: jasmine.createSpy().andReturn(443),
                        height: jasmine.createSpy().andReturn(403)
                    };
                    var pos = box.applyPivot(basePos, pivot, bounds);
                    expect(pos.x()).toEqual(413);
                    expect(pos.y()).toEqual(388);
                });

                it("does not reverse vertical direction if it does overflow the bounds element", function() {
                    var bounds = {
                        width: jasmine.createSpy().andReturn(443),
                        height: jasmine.createSpy().andReturn(448)
                    };
                    var pos = box.applyPivot(basePos, pivot, bounds);
                    expect(pos.x()).toEqual(413);
                    expect(pos.y()).toEqual(392);
                });
            });
            
        });
        
        describe("positionToFraction", function() {
            
            var positionToFraction = CalloutBox.prototype.positionToFraction;
            
            it("converts logical CSS positions to fractions", function() {
                expect(positionToFraction('top')).toEqual(0);
                expect(positionToFraction('left')).toEqual(0);
                expect(positionToFraction('centre')).toEqual(.5);
                expect(positionToFraction('center')).toEqual(.5);
                expect(positionToFraction('middle')).toEqual(.5);
                expect(positionToFraction('bottom')).toEqual(1);
                expect(positionToFraction('right')).toEqual(1);
                expect(positionToFraction('foo')).toBe(null);
            });
            
            it("converts percentage values to fractions", function() {
                expect(positionToFraction('0%')).toEqual(0);
                expect(positionToFraction('50%')).toEqual(.5);
                expect(positionToFraction('100%')).toEqual(1);
                expect(positionToFraction('11%')).toEqual(.11);
            });
            
            it("limits the range of percentages to fractions", function() {
                expect(positionToFraction('-30%')).toEqual(0);
                expect(positionToFraction('101%')).toEqual(1);
            });
            
            it("limits the range of numbers to fractions", function() {
                expect(positionToFraction(-1)).toEqual(0);
                expect(positionToFraction(1.3)).toEqual(1);
            });
            
            it("leaves fractions untouched", function() {
                expect(positionToFraction(0)).toEqual(0);
                expect(positionToFraction(.4)).toEqual(.4);
                expect(positionToFraction(.8)).toEqual(.8);
                expect(positionToFraction(1)).toEqual(1);
            });
        });
        
        
        describe("offsetFromTopLeft", function() {
            var box;
            beforeEach(function() {
            
                var params = {
                    xPos:15,
                    yPos:45,
                    parent:'#test-div',
                    content:'test'
                };
                box = new CalloutBox(params);
                box.element = {
                    width: jasmine.createSpy().andReturn(400),
                    height: jasmine.createSpy().andReturn(300)
                }
                spyOn(box, "positionToFraction").andCallThrough();
            });
            
            it("returns the offset from the top left corner", function() {
                var point = box.offsetFromTopLeft('left', 'top');
                expect(point.x()).toEqual(0);
                expect(point.y()).toEqual(0);
                
                expect(box.positionToFraction).toHaveBeenCalledWith('left');
                expect(box.positionToFraction).toHaveBeenCalledWith('top');
                
                point = box.offsetFromTopLeft('centre', 'centre');
                expect(point.x()).toEqual(200);
                expect(point.y()).toEqual(150);
                
                point = box.offsetFromTopLeft('right', 'bottom');
                expect(point.x()).toEqual(400);
                expect(point.y()).toEqual(300);
                
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