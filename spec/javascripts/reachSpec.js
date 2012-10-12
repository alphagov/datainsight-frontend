describe("reach", function() {
    var stubGraphDiv = $('<div id="reach-chart"></div>'),
        rawData = null;
    beforeEach(function() {
        rawData = [
            {"hour_of_day": 0, "visitors":{"yesterday":666, "last_week_average": 321}},
            {"hour_of_day": 1, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 2, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 3, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 4, "visitors":{"yesterday":666, "last_week_average": 321}},
            {"hour_of_day": 5, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 6, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 7, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 8, "visitors":{"yesterday":666, "last_week_average": 321}},
            {"hour_of_day": 9, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 10, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 11, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 12, "visitors":{"yesterday":666, "last_week_average": 321}},
            {"hour_of_day": 13, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 14, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 15, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 16, "visitors":{"yesterday":666, "last_week_average": 321}},
            {"hour_of_day": 17, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 18, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 19, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 20, "visitors":{"yesterday":666, "last_week_average": 321}},
            {"hour_of_day": 21, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 22, "visitors":{"yesterday":667, "last_week_average": 322}},
            {"hour_of_day": 23, "visitors":{"yesterday":667, "last_week_average": 322}}
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