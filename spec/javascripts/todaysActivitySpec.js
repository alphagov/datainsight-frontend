describe("todays data graph generation", function () {
    var stubGraphDiv = $('<div id="todays-activity-module"><img src="https://www.google.com/images/srpr/logo3w.png" /><div class="datainsight-hidden" id="hidden-stuff"><span id="live_at"></span><span class="for_date"></span><div id="reach"></div>I am all invisible and stuff</div></div>');

    var jsonResponse = {};
    var stubAjaxResponder = function (successFunction) {
        successFunction(jsonResponse);
    };

    beforeEach(function () {
        jsonResponse = {"live_at":"2012-08-14T18:45:00+01:00", "for_date": "2012-08-13", "values":[
            {"hour_of_day":0, "visitors":{"yesterday":7500, "last_week_average":500}},
            {"hour_of_day":1, "visitors":{"yesterday":8730, "last_week_average":8730}},
            {"hour_of_day":2, "visitors":{"yesterday":6705, "last_week_average":6705}},
            {"hour_of_day":3, "visitors":{"yesterday":3200, "last_week_average":5200}},
            {"hour_of_day":4, "visitors":{"yesterday":5490, "last_week_average":4000}},
            {"hour_of_day":5, "visitors":{"yesterday":4567, "last_week_average":4567}},
            {"hour_of_day":6, "visitors":{"yesterday":6108, "last_week_average":6108}},
            {"hour_of_day":7, "visitors":{"yesterday":3780, "last_week_average":3780}},
            {"hour_of_day":8, "visitors":{"yesterday":5670, "last_week_average":5670}},
            {"hour_of_day":9, "visitors":{"yesterday":17565, "last_week_average":8000}},
            {"hour_of_day":10, "visitors":{"yesterday":11234, "last_week_average":11234}},
            {"hour_of_day":11, "visitors":{"yesterday":10237, "last_week_average":10237}},
            {"hour_of_day":12, "visitors":{"yesterday":6700, "last_week_average":9000}},
            {"hour_of_day":13, "visitors":{"yesterday":8700, "last_week_average":8700}},
            {"hour_of_day":14, "visitors":{"yesterday":3400, "last_week_average":3400}},
            {"hour_of_day":15, "visitors":{"yesterday":11002, "last_week_average":11002}},
            {"hour_of_day":16, "visitors":{"yesterday":6321, "last_week_average":6321}},
            {"hour_of_day":17, "visitors":{"yesterday":8999, "last_week_average":8999}},
            {"hour_of_day":18, "visitors":{"yesterday":3456, "last_week_average":3456}},
            {"hour_of_day":19, "visitors":{"yesterday":5000, "last_week_average":5000}},
            {"hour_of_day":20, "visitors":{"yesterday":5345, "last_week_average":5345}},
            {"hour_of_day":21, "visitors":{"yesterday":0, "last_week_average":7000}},
            {"hour_of_day":22, "visitors":{"yesterday":0, "last_week_average":7600}},
            {"hour_of_day":23, "visitors":{"yesterday":0, "last_week_average":4500}}
        ]};
        // clone every time to avoid state in tests
        stubGraphDiv.clone().appendTo('body');
        spyOn(jQuery, 'ajax').andCallFake(function (options) {
            stubAjaxResponder(options.success);
        });
    });

    afterEach(function () {
        $('#todays-activity-module').remove();
        jQuery.ajax.reset();
    });

    it("should hide image, show graph titles and generate an svg graph from json data", function () {
        GOVUK.Insights.todaysActivity();

        expect(jQuery.ajax).toHaveBeenCalled();

        var svg = $('#todays-activity-module').find('svg');
        var img = $('#todays-activity-module').find('img');

        expect(svg.length).not.toBe(0);
        expect($('#hidden-stuff').hasClass('datainsight-hidden')).toBeFalsy();
        expect(img.length).toBe(0);
    });

    it("should remove the png instead if svgs are not supported", function () {
        spyOn(GOVUK, "isSvgSupported").andReturn(false);

        GOVUK.Insights.todaysActivity();

        expect(jQuery.ajax).toHaveBeenCalled();

        var png = $('#todays-activity-module').find('img');
        expect(png.length).not.toBe(0);
    });

    it("should display an error message if there is no data to be shown", function () {
        jsonResponse = null;

        // assuming the jasmine spec browser will support svgs but just to be safe...
        spyOn(GOVUK, "isSvgSupported").andReturn(true);

        GOVUK.Insights.todaysActivity();

        expect(jQuery.ajax).toHaveBeenCalled();

        var actualErrorMsg = $('#reach').find('#error-msg').text();
        var expectedErrorMsg = $(GOVUK.Insights.Helpers.error_div).text();

        expect(actualErrorMsg).toBe(expectedErrorMsg);

    });

    it("should display for date in a proper format", function () {
        GOVUK.Insights.todaysActivity();

        expect(jQuery.ajax).toHaveBeenCalled();

        var actualForDateLabel = $('#todays-activity-module .for_date').text();
        var expectedForDateLabel = "13 August";

        expect(actualForDateLabel).toBe(expectedForDateLabel);

    });
});
