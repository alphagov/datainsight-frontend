describe("time series helper", function() {
    describe("months_range", function() {
        it("should produce correct range for mid month", function() {
            var start = new Date(2011, 1, 10),
                end   = new Date(2011, 7, 15),
                step  = 2;
            expect(GOVUK.Insights.months_range(start, end, step)).toEqual(
                [new Date(2011, 1, 15), new Date(2011, 3, 15), new Date(2011, 5, 15), new Date(2011, 7, 15)]
            );
        });

        it("should produce correct range for end of month", function() {
            var start = new Date(2012, 0, 30),
                end   = new Date(2012, 6, 30),
                step  = 2;
            expect(GOVUK.Insights.months_range(start, end, step)).toEqual(
                [new Date(2012, 0, 30), new Date(2012, 2, 30), new Date(2012, 4, 30), new Date(2012, 6, 30)]
            );
        });

        it("should produce correct range for end of year", function() {
            var start = new Date(2012, 11, 30),
                end   = new Date(2013, 5, 30),
                step  = 2;
            expect(GOVUK.Insights.months_range(start, end, step)).toEqual(
                [new Date(2012, 11, 30), new Date(2013, 1, 28), new Date(2013, 3, 30), new Date(2013, 5, 30)]
            );
        });
    });
});
