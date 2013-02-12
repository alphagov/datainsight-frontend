describe("format success graph", function () {
    var stubGraphDiv = $('<div id="format-success-module"><ul id="format-success-tabs"><li data-format="answer"></li></ul><img src="https://www.google.com/images/srpr/logo3w.png" /><div class="datainsight-hidden" id="hidden-stuff"><div id="format-success"></div>I am all invisible and stuff</div></div>');

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

    it("should hide image, show graph titles and generate an svg graph from json data", function () {
        GOVUK.Insights.formatTitles = {
            Guide: 'Guide'
        };
        GOVUK.Insights.formatSuccess();

        expect(jQuery.ajax).toHaveBeenCalled();

        var svg = $('#format-success-module').find('svg');
        var img = $('#format-success-module').find('img');
        
        expect(svg.length).not.toBe(0);
        expect($('#hidden-stuff').hasClass('datainsight-hidden')).toBeFalsy();
        expect(img.length).toBe(0);
    });

    it("should remove the png instead if svgs are not supported", function () {
        spyOn(GOVUK, "isSvgSupported").andReturn(false);

        GOVUK.Insights.formatSuccess();

        expect(jQuery.ajax).toHaveBeenCalled();

        var png = $('#format-success-module').find('img');
        expect(png.length).not.toBe(0);
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
});
