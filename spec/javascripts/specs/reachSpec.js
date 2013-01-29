describe("reach", function() {
    var stubGraphDiv = $('<div id="reach-chart"></div>'),
        rawData = null;
    beforeEach(function() {
        rawData = [
            { "start_at":"2012-08-13T00:00:00+01:00", "end_at":"2012-08-13T01:00:00+01:00", "visitors":666, "last_week_average": 321 },
            { "start_at":"2012-08-13T01:00:00+01:00", "end_at":"2012-08-13T02:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T02:00:00+01:00", "end_at":"2012-08-13T03:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T03:00:00+01:00", "end_at":"2012-08-13T04:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T04:00:00+01:00", "end_at":"2012-08-13T05:00:00+01:00", "visitors":666, "last_week_average": 321 },
            { "start_at":"2012-08-13T05:00:00+01:00", "end_at":"2012-08-13T06:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T06:00:00+01:00", "end_at":"2012-08-13T07:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T07:00:00+01:00", "end_at":"2012-08-13T08:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T08:00:00+01:00", "end_at":"2012-08-13T09:00:00+01:00", "visitors":666, "last_week_average": 321 },
            { "start_at":"2012-08-13T09:00:00+01:00", "end_at":"2012-08-13T10:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T10:00:00+01:00", "end_at":"2012-08-13T11:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T11:00:00+01:00", "end_at":"2012-08-13T12:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T12:00:00+01:00", "end_at":"2012-08-13T13:00:00+01:00", "visitors":666, "last_week_average": 321 },
            { "start_at":"2012-08-13T13:00:00+01:00", "end_at":"2012-08-13T14:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T14:00:00+01:00", "end_at":"2012-08-13T15:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T15:00:00+01:00", "end_at":"2012-08-13T16:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T16:00:00+01:00", "end_at":"2012-08-13T17:00:00+01:00", "visitors":666, "last_week_average": 321 },
            { "start_at":"2012-08-13T17:00:00+01:00", "end_at":"2012-08-13T18:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T18:00:00+01:00", "end_at":"2012-08-13T19:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T19:00:00+01:00", "end_at":"2012-08-13T20:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T20:00:00+01:00", "end_at":"2012-08-13T21:00:00+01:00", "visitors":666, "last_week_average": 321 },
            { "start_at":"2012-08-13T21:00:00+01:00", "end_at":"2012-08-13T22:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T22:00:00+01:00", "end_at":"2012-08-13T23:00:00+01:00", "visitors":667, "last_week_average": 322 },
            { "start_at":"2012-08-13T23:00:00+01:00", "end_at":"2012-08-14T00:00:00+01:00", "visitors":667, "last_week_average": 322 }
        ];

        stubGraphDiv.clone().appendTo('body');
    });

    afterEach(function() {
        $("#reach-chart").remove();
    })

    describe("fillCalculator", function() {
        it("should calculate fill colour", function() {
            var averages = [4, 5, 6, 7, 100],
                colours = GOVUK.Insights.Reach.COLOURS,
                calculateFill = GOVUK.Insights.Reach.fillCalculator(averages, colours);

            expect(calculateFill(10, 0).toUpperCase()).toEqual(colours.STRONG_GREEN);
            expect(calculateFill(0, 4).toUpperCase()).toEqual(colours.STRONG_RED);
            expect(calculateFill(4, 0).toUpperCase()).toEqual(colours.CENTER_GREY);
            expect(calculateFill(4.8, 0).toUpperCase()).toEqual(colours.CENTER_GREY);
        });
    });

    describe("render the chart", function() {
        beforeEach(function() {
            GOVUK.Insights.Reach.plotTraffic("reach-chart", rawData);
        });

        it("should have 24 bars", function() {
            expect($("#reach-chart rect.bar").length).toEqual(24);
        });

        it("should have 1 average line", function() {
            expect($("#reach-chart path.dashed-line").length).toEqual(1);
        });

        it("should have 5 correct x-axis labels", function() {
            var labels = $.map($("#reach-chart .x.axis text"), function(item) {
                return $(item).text();
            });
            expect(labels).toEqual(["4am", "8am", "12pm", "4pm", "8pm"])
        })
    });
});