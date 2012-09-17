describe("todays data graph generation", function () {
    var stubGraphDiv = $('<div id="todays-activity-module"><span id="live_at"></span><div id="reach"></div></div>');

    var jsonResponse = {};
    var stubAjaxResponder = function (successFunction) {
        successFunction(jsonResponse);
    }

    beforeEach(function () {
        jsonResponse = {"live_at":"2012-08-14T18:45:00+01:00", "values":[
            {"hour_of_day":0, "visitors":{"yesterday":7500, "today":7500, "monthly_average":500}},
            {"hour_of_day":1, "visitors":{"yesterday":8730, "today":8730, "monthly_average":8730}},
            {"hour_of_day":2, "visitors":{"yesterday":6705, "today":6705, "monthly_average":6705}},
            {"hour_of_day":3, "visitors":{"yesterday":3200, "today":3200, "monthly_average":5200}},
            {"hour_of_day":4, "visitors":{"yesterday":5490, "today":5490, "monthly_average":4000}},
            {"hour_of_day":5, "visitors":{"yesterday":4567, "today":4567, "monthly_average":4567}},
            {"hour_of_day":6, "visitors":{"yesterday":6108, "today":6108, "monthly_average":6108}},
            {"hour_of_day":7, "visitors":{"yesterday":3780, "today":3780, "monthly_average":3780}},
            {"hour_of_day":8, "visitors":{"yesterday":5670, "monthly_average":5670}},
            {"hour_of_day":9, "visitors":{"yesterday":17565, "monthly_average":8000}},
            {"hour_of_day":10, "visitors":{"yesterday":11234, "monthly_average":11234}},
            {"hour_of_day":11, "visitors":{"yesterday":10237, "monthly_average":10237}},
            {"hour_of_day":12, "visitors":{"yesterday":6700, "monthly_average":9000}},
            {"hour_of_day":13, "visitors":{"yesterday":8700, "monthly_average":8700}},
            {"hour_of_day":14, "visitors":{"yesterday":3400, "monthly_average":3400}},
            {"hour_of_day":15, "visitors":{"yesterday":11002, "monthly_average":11002}},
            {"hour_of_day":16, "visitors":{"yesterday":6321, "monthly_average":6321}},
            {"hour_of_day":17, "visitors":{"yesterday":8999, "monthly_average":8999}},
            {"hour_of_day":18, "visitors":{"yesterday":3456, "monthly_average":3456}},
            {"hour_of_day":19, "visitors":{"yesterday":5000, "monthly_average":5000}},
            {"hour_of_day":20, "visitors":{"yesterday":5345, "monthly_average":5345}},
            {"hour_of_day":21, "visitors":{"yesterday":0, "monthly_average":7000}},
            {"hour_of_day":22, "visitors":{"yesterday":0, "monthly_average":7600}},
            {"hour_of_day":23, "visitors":{"yesterday":0, "monthly_average":4500}}
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

    it("should generate an svg graph from json data", function () {
        GOVUK.Insights.todaysActivity();

        expect(jQuery.ajax).toHaveBeenCalled();

        var svg = $('#todays-activity-module').find('svg');
        expect(svg.length).not.toBe(0);
    });

    it("should display a png instead of a graph is svgs are not supported", function () {
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

    it("should display live at in a proper format", function () {
        GOVUK.Insights.todaysActivity();

        expect(jQuery.ajax).toHaveBeenCalled();

        var actualLiveAtLabel = $('#live_at').text();
        var expectedLiveAtLabel = "Tuesday 14th August, 17:45 GMT"

        expect(actualLiveAtLabel).toBe(expectedLiveAtLabel);

    });
});
