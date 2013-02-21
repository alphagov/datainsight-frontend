describe("format success graph", function () {
    var stubGraphDiv = $('<div id="format-success-module"><ul id="format-success-tabs"><li data-format="answer"></li></ul><img src="https://www.google.com/images/srpr/logo3w.png" /><div id="format-success" class="placeholder"></div>I am all invisible and stuff</div>');

    var jsonResponse = {};
    var stubAjaxResponder = function (successFunction) {
        successFunction(jsonResponse);
    };

    beforeEach(function () {
        jsonResponse = {
            "response_info":{"status":"ok"},
            "id":"http://datainsight-frontend.dev.gov.uk/performance/dashboard/format-success.json",
            "details": {
                "data": [
                    {
                        "entries": 2781,
                        "percentage_of_success": 0.107874865,
                        "slug": "1619-bursary-fund",
                        "format": "answer"
                    },
                    {
                        "entries": 2871,
                        "percentage_of_success": 0.139324277,
                        "slug": "24_advanced_learning_loans",
                        "format": "answer"
                    }
                ]
            },
            "updated_at":"2012-10-30T09:27:34+00:00"
        };

        // clone every time to avoid state in tests
        stubGraphDiv.clone().appendTo('body');
        spyOn(jQuery, 'ajax').andCallFake(function (options) {
            stubAjaxResponder(options.success);
        });
    });

    afterEach(function () {
        $('#format-success-module').remove();
        jQuery.ajax.reset();
    });

    it("should remove placeholder, show graph titles and generate an svg graph from json data", function () {
        
        expect($('#format-success-module').find('svg').length).toBe(0);
        
        expect($('#format-success').hasClass('placeholder')).toBe(true);
        
        
        GOVUK.Insights.formats = {
            Guide: {
                title: 'Guide'
            }
        };
        spyOn(GOVUK.Insights, "updateEngagementCriteria");
        GOVUK.Insights.formatSuccess();

        expect(jQuery.ajax).toHaveBeenCalled();
        expect(GOVUK.Insights.updateEngagementCriteria).toHaveBeenCalled();

        expect($('#format-success-module').find('svg').length).not.toBe(0);
        
        expect($('#format-success').hasClass('placeholder')).toBe(false);
    });

    it("should display an error message if there is no data to be shown", function () {
        jsonResponse = null;

        // assuming the jasmine spec browser will support svgs but just to be safe...
        spyOn(GOVUK, "isSvgSupported").andReturn(true);

        GOVUK.Insights.formatSuccess();

        expect(jQuery.ajax).toHaveBeenCalled();

        var actualErrorMsg = $('#format-success-module').find('#error-msg').text();
        var expectedErrorMsg = $(GOVUK.Insights.Helpers.error_div).text();

        expect(actualErrorMsg).toBe(expectedErrorMsg);

    });
    
    describe("updateHeadline", function() {
        var updateHeadline = GOVUK.Insights.updateHeadline;
        var el, selectOptions;
        beforeEach(function() {
            formatData = {
                foo: {
                    headline: 'foo'
                },
                bar: {
                    headline: 'item of bar',
                    headlinePlural: 'items of bar'
                },
            }
            el = {
                html: jasmine.createSpy()
            };
            selectOptions = [
                {
                    entries: 1000
                },
                {
                    entries: 4000
                }
            ];
        });
        
        it("updates headline for default singular case and no search term", function() {
            selectOptions = selectOptions.slice(0, 1);
            updateHeadline(el, '', selectOptions, formatData.foo);
            expect(el.html).toHaveBeenCalledWith(
                '<em>1</em> foo, viewed&nbsp;<em>1.00k&nbsp;times</em>'
            );
        });
        
        it("updates headline for default plural case and no search term", function() {
            updateHeadline(el, '', selectOptions, formatData.foo);
            expect(el.html).toHaveBeenCalledWith(
                '<em>2</em> foos, viewed&nbsp;<em>5.00k&nbsp;times</em>'
            );
        });
        
        it("updates headline for custom singular case and no search term", function() {
            selectOptions = selectOptions.slice(0, 1);
            updateHeadline(el, '', selectOptions, formatData.bar);
            expect(el.html).toHaveBeenCalledWith(
                '<em>1</em> item of bar, viewed&nbsp;<em>1.00k&nbsp;times</em>'
            );
        });
        
        it("updates headline for custom plural case and no search term", function() {
            updateHeadline(el, '', selectOptions, formatData.bar);
            expect(el.html).toHaveBeenCalledWith(
                '<em>2</em> items of bar, viewed&nbsp;<em>5.00k&nbsp;times</em>'
            );
        });
        
        it("updates headline for default singular case and with search term", function() {
            selectOptions = selectOptions.slice(0, 1);
            updateHeadline(el, 'term', selectOptions, formatData.foo);
            expect(el.html).toHaveBeenCalledWith(
                '<em>1</em> foo containing <em>&ldquo;term&rdquo;</em>, viewed&nbsp;<em>1.00k&nbsp;times</em>'
            );
        });
        
        it("updates headline for default plural case and with search term", function() {
            updateHeadline(el, 'term', selectOptions, formatData.foo);
            expect(el.html).toHaveBeenCalledWith(
                '<em>2</em> foos containing <em>&ldquo;term&rdquo;</em>, viewed&nbsp;<em>5.00k&nbsp;times</em>'
            );
        });
        
        it("updates headline for custom singular case and with search term", function() {
            selectOptions = selectOptions.slice(0, 1);
            updateHeadline(el, 'term', selectOptions, formatData.bar);
            expect(el.html).toHaveBeenCalledWith(
                '<em>1</em> item of bar containing <em>&ldquo;term&rdquo;</em>, viewed&nbsp;<em>1.00k&nbsp;times</em>'
            );
        });
        
        it("updates headline for custom plural case and with search term", function() {
            updateHeadline(el, 'term', selectOptions, formatData.bar);
            expect(el.html).toHaveBeenCalledWith(
                '<em>2</em> items of bar containing <em>&ldquo;term&rdquo;</em>, viewed&nbsp;<em>5.00k&nbsp;times</em>'
            );
        });
    });
    
    describe("updateExcludedItemsCount", function() {
        
        var el;
        beforeEach(function() {
            el = $('<div id="excluded-items-wrapper"><p class="excluded-items"><span class="num-items-excluded"></span></p></div>');
            el.appendTo('body');
        });
        
        afterEach(function() {
            el.remove();
        });
        
        it("should hide the counter when there are no excluded items", function() {
            GOVUK.Insights.updateExcludedItemsCount(0, el);
            expect($('#excluded-items-wrapper excluded-items').is(':visible')).toBe(false);
        });
        
        it("should update the counter with the number of excluded items", function() {
            GOVUK.Insights.updateExcludedItemsCount(23, el);
            expect($('#excluded-items-wrapper .excluded-items').is(':visible')).toBe(true);
            expect($('#excluded-items-wrapper .num-items-excluded').text()).toEqual('23');
        });
        
    });
    
    describe("updateEngagementCriteria", function() {
        
        var el;
        beforeEach(function() {
            el = $('<div id="engagement-criteria"><h4></h4><p></p></div>');
            el.appendTo($('body'));
        });
        
        afterEach(function() {
            el.remove();
        });
        
        it("updates the engagement criteria text for the current format", function() {
            GOVUK.Insights.updateEngagementCriteria({
                title: 'Foo',
                criteria: 'User forgets to close browser window.'
            });
            expect(el.html()).toEqual([
                '<h4>Foo engagement criteria</h4>',
                '<p>User forgets to close browser window.</p>'
            ].join(''));
        });
        
    });
    
    describe("formatSuccessTableComparator", function() {
        
        var comparator = GOVUK.Insights.formatSuccessTableComparator;
        
        var data;
        beforeEach(function() {
            data = [
                { number: 3,    title: 'a', slug: 'a' },
                { number: 2,    title: 'c', slug: 'c' },
                { number: 0,    title: 'b', slug: 'b' },
                { number: null, title: 'e', slug: 'ignored' },
                { number: null, title: 'd', slug: 'ignored' },
                { number: null, slug: 'h' },
                { number: null, slug: 'g' },
            ];
        });
        
        it("sorts numbers ascending and uses title or slug for alphabetical ascending fallback", function() {
            data.sort(function (a, b) {
                return comparator(a, b, 'number', false);
            });
            expect(data).toEqual([
                { number: 0,    title: 'b', slug: 'b' },
                { number: 2,    title: 'c', slug: 'c' },
                { number: 3,    title: 'a', slug: 'a' },
                { number: null, title: 'd', slug: 'ignored' },
                { number: null, title: 'e', slug: 'ignored' },
                { number: null, slug: 'g' },
                { number: null, slug: 'h' },
            ]);
        });
        
        it("sorts numbers descending and uses title or slug for alphabetical ascending fallback", function() {
            data.sort(function (a, b) {
                return comparator(a, b, 'number', true);
            });
            expect(data).toEqual([
                { number: 3,    title: 'a', slug: 'a' },
                { number: 2,    title: 'c', slug: 'c' },
                { number: 0,    title: 'b', slug: 'b' },
                { number: null, title: 'd', slug: 'ignored' },
                { number: null, title: 'e', slug: 'ignored' },
                { number: null, slug: 'g' },
                { number: null, slug: 'h' },
            ]);
        });
    });
});
