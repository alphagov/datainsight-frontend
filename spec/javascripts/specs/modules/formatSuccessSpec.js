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
            "web_url":"http://datainsight-frontend.dev.gov.uk/performance/dashboard/format-success",
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
        
        
        GOVUK.Insights.formatTitles = {
            Guide: 'Guide'
        };
        GOVUK.Insights.formatSuccess();

        expect(jQuery.ajax).toHaveBeenCalled();

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
});
