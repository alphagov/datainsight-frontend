describe("hourly traffic graph generation", function () {
    var stubGraphDiv = $('<div id="hourly-traffic-module"><img src="https://www.google.com/images/srpr/logo3w.png" /><div class="datainsight-hidden" id="hidden-stuff"><span class="for_date"></span><div id="reach"></div>I am all invisible and stuff</div></div>');

    var jsonResponse = {};
    var stubAjaxResponder = function (successFunction) {
        successFunction(jsonResponse);
    };

    beforeEach(function () {
        jsonResponse = {
            "response_info":{
                "status":"ok"
            },
            "id":"http://datainsight-frontend.dev.gov.uk/performance/dashboard/hourly-traffic.json",
            "web_url":"http://datainsight-frontend.dev.gov.uk/performance/dashboard/hourly-traffic",
            "details":{
                "source":["Google Analytics"],
                "for_date":"2012-08-13",
                "metric": "visitors",
                "data":[
                    {"hour_of_day":0, "value":{"yesterday":7500, "last_week_average":500}},
                    {"hour_of_day":1, "value":{"yesterday":8730, "last_week_average":8730}},
                    {"hour_of_day":2, "value":{"yesterday":6705, "last_week_average":6705}},
                    {"hour_of_day":3, "value":{"yesterday":3200, "last_week_average":5200}},
                    {"hour_of_day":4, "value":{"yesterday":5490, "last_week_average":4000}},
                    {"hour_of_day":5, "value":{"yesterday":4567, "last_week_average":4567}},
                    {"hour_of_day":6, "value":{"yesterday":6108, "last_week_average":6108}},
                    {"hour_of_day":7, "value":{"yesterday":3780, "last_week_average":3780}},
                    {"hour_of_day":8, "value":{"yesterday":5670, "last_week_average":5670}},
                    {"hour_of_day":9, "value":{"yesterday":17565, "last_week_average":8000}},
                    {"hour_of_day":10, "value":{"yesterday":11234, "last_week_average":11234}},
                    {"hour_of_day":11, "value":{"yesterday":10237, "last_week_average":10237}},
                    {"hour_of_day":12, "value":{"yesterday":6700, "last_week_average":9000}},
                    {"hour_of_day":13, "value":{"yesterday":8700, "last_week_average":8700}},
                    {"hour_of_day":14, "value":{"yesterday":3400, "last_week_average":3400}},
                    {"hour_of_day":15, "value":{"yesterday":11002, "last_week_average":11002}},
                    {"hour_of_day":16, "value":{"yesterday":6321, "last_week_average":6321}},
                    {"hour_of_day":17, "value":{"yesterday":8999, "last_week_average":8999}},
                    {"hour_of_day":18, "value":{"yesterday":3456, "last_week_average":3456}},
                    {"hour_of_day":19, "value":{"yesterday":5000, "last_week_average":5000}},
                    {"hour_of_day":20, "value":{"yesterday":5345, "last_week_average":5345}},
                    {"hour_of_day":21, "value":{"yesterday":0, "last_week_average":7000}},
                    {"hour_of_day":22, "value":{"yesterday":0, "last_week_average":7600}},
                    {"hour_of_day":23, "value":{"yesterday":0, "last_week_average":4500}}
                ]
            },
            "updated_at":"2012-10-30T09:26:55+00:00"
        };
        // clone every time to avoid state in tests
        stubGraphDiv.clone().appendTo('body');
        spyOn(jQuery, 'ajax').andCallFake(function (options) {
            stubAjaxResponder(options.success);
        });
    });

    afterEach(function () {
        $('#hourly-traffic-module').remove();
        jQuery.ajax.reset();
    });

    it("should hide image, show graph titles and generate an svg graph from json data", function () {
        GOVUK.Insights.hourlyTraffic();

        expect(jQuery.ajax).toHaveBeenCalled();

        var svg = $('#hourly-traffic-module').find('svg');
        var img = $('#hourly-traffic-module').find('img');

        expect(svg.length).not.toBe(0);
        expect($('#hidden-stuff').hasClass('datainsight-hidden')).toBeFalsy();
        expect(img.length).toBe(0);
    });

    it("should remove the png instead if svgs are not supported", function () {
        spyOn(GOVUK, "isSvgSupported").andReturn(false);

        GOVUK.Insights.hourlyTraffic();

        expect(jQuery.ajax).toHaveBeenCalled();

        var png = $('#hourly-traffic-module').find('img');
        expect(png.length).not.toBe(0);
    });

    it("should display an error message if there is no data to be shown", function () {
        jsonResponse = null;

        // assuming the jasmine spec browser will support svgs but just to be safe...
        spyOn(GOVUK, "isSvgSupported").andReturn(true);

        GOVUK.Insights.hourlyTraffic();

        expect(jQuery.ajax).toHaveBeenCalled();

        var actualErrorMsg = $('#reach').find('#error-msg').text();
        var expectedErrorMsg = $(GOVUK.Insights.Helpers.error_div).text();

        expect(actualErrorMsg).toBe(expectedErrorMsg);

    });

    it("should display for date in a proper format", function () {
        GOVUK.Insights.hourlyTraffic();

        expect(jQuery.ajax).toHaveBeenCalled();

        var actualForDateLabel = $('#hourly-traffic-module .for_date').text();
        var expectedForDateLabel = "13 August";

        expect(actualForDateLabel).toBe(expectedForDateLabel);

    });
});
