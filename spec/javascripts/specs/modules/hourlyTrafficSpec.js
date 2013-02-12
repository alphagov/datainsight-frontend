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
            "details":{
                "source":["Google Analytics"],
                "data":[
                    { "start_at":"2012-08-13T00:00:00+01:00", "end_at":"2012-08-13T01:00:00+01:00", "visitors":7500,  "last_week_average":500   },
                    { "start_at":"2012-08-13T01:00:00+01:00", "end_at":"2012-08-13T02:00:00+01:00", "visitors":8730,  "last_week_average":8730  },
                    { "start_at":"2012-08-13T02:00:00+01:00", "end_at":"2012-08-13T03:00:00+01:00", "visitors":6705,  "last_week_average":6705  },
                    { "start_at":"2012-08-13T03:00:00+01:00", "end_at":"2012-08-13T04:00:00+01:00", "visitors":3200,  "last_week_average":5200  },
                    { "start_at":"2012-08-13T04:00:00+01:00", "end_at":"2012-08-13T05:00:00+01:00", "visitors":5490,  "last_week_average":4000  },
                    { "start_at":"2012-08-13T05:00:00+01:00", "end_at":"2012-08-13T06:00:00+01:00", "visitors":4567,  "last_week_average":4567  },
                    { "start_at":"2012-08-13T06:00:00+01:00", "end_at":"2012-08-13T07:00:00+01:00", "visitors":6108,  "last_week_average":6108  },
                    { "start_at":"2012-08-13T07:00:00+01:00", "end_at":"2012-08-13T08:00:00+01:00", "visitors":3780,  "last_week_average":3780  },
                    { "start_at":"2012-08-13T08:00:00+01:00", "end_at":"2012-08-13T09:00:00+01:00", "visitors":5670,  "last_week_average":5670  },
                    { "start_at":"2012-08-13T09:00:00+01:00", "end_at":"2012-08-13T10:00:00+01:00", "visitors":17565, "last_week_average":8000  },
                    { "start_at":"2012-08-13T10:00:00+01:00", "end_at":"2012-08-13T11:00:00+01:00", "visitors":11234, "last_week_average":11234 },
                    { "start_at":"2012-08-13T11:00:00+01:00", "end_at":"2012-08-13T12:00:00+01:00", "visitors":10237, "last_week_average":10237 },
                    { "start_at":"2012-08-13T12:00:00+01:00", "end_at":"2012-08-13T13:00:00+01:00", "visitors":6700,  "last_week_average":9000  },
                    { "start_at":"2012-08-13T13:00:00+01:00", "end_at":"2012-08-13T14:00:00+01:00", "visitors":8700,  "last_week_average":8700  },
                    { "start_at":"2012-08-13T14:00:00+01:00", "end_at":"2012-08-13T15:00:00+01:00", "visitors":3400,  "last_week_average":3400  },
                    { "start_at":"2012-08-13T15:00:00+01:00", "end_at":"2012-08-13T16:00:00+01:00", "visitors":11002, "last_week_average":11002 },
                    { "start_at":"2012-08-13T16:00:00+01:00", "end_at":"2012-08-13T17:00:00+01:00", "visitors":6321,  "last_week_average":6321  },
                    { "start_at":"2012-08-13T17:00:00+01:00", "end_at":"2012-08-13T18:00:00+01:00", "visitors":8999,  "last_week_average":8999  },
                    { "start_at":"2012-08-13T18:00:00+01:00", "end_at":"2012-08-13T19:00:00+01:00", "visitors":3456,  "last_week_average":3456  },
                    { "start_at":"2012-08-13T19:00:00+01:00", "end_at":"2012-08-13T20:00:00+01:00", "visitors":5000,  "last_week_average":5000  },
                    { "start_at":"2012-08-13T20:00:00+01:00", "end_at":"2012-08-13T21:00:00+01:00", "visitors":5345,  "last_week_average":5345  },
                    { "start_at":"2012-08-13T21:00:00+01:00", "end_at":"2012-08-13T22:00:00+01:00", "visitors":0,     "last_week_average":7000  },
                    { "start_at":"2012-08-13T22:00:00+01:00", "end_at":"2012-08-13T23:00:00+01:00", "visitors":0,     "last_week_average":7600  },
                    { "start_at":"2012-08-13T23:00:00+01:00", "end_at":"2012-08-14T00:00:00+01:00", "visitors":0,     "last_week_average":4500  }
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
