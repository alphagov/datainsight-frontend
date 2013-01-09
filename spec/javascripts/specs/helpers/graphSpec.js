describe("Helpers", function () {
    describe("calculateLinearTicks", function() {
        it("should return valid ticks for 0-7000 with step of 5", function() {
            var ticks = GOVUK.Insights.calculateLinearTicks([0, 7000], 5);
            expect(ticks.values).toEqual([0, 2000, 4000, 6000, 8000]);
            expect(ticks.extent).toEqual([0, 8000]);
            expect(ticks.step).toEqual(2000);
        });
        it("should be good for our tests", function() {
            var extent = [0, 61241];
            expect(GOVUK.Insights.calculateLinearTicks(extent, 2).values)
                .toEqual([0, 50000, 100000]);
            expect(GOVUK.Insights.calculateLinearTicks(extent, 3).values)
                .toEqual([0, 50000, 100000]);
            expect(GOVUK.Insights.calculateLinearTicks(extent, 4).values)
                .toEqual([0, 20000, 40000, 60000, 80000]);
            expect(GOVUK.Insights.calculateLinearTicks(extent, 5).values)
                .toEqual([0, 20000, 40000, 60000, 80000]);
        });
        it("should return valid ticks for 0-7000 with step of 10", function() {
            var ticks = GOVUK.Insights.calculateLinearTicks([0, 7000], 10);
            expect(ticks.values).toEqual([0, 1000, 2000, 3000, 4000, 5000, 6000, 7000]);
            expect(ticks.extent).toEqual([0, 7000]);
            expect(ticks.step).toEqual(1000);
        });
        it("should return valid ticks for 0-5 with step of 10", function() {
            var ticks = GOVUK.Insights.calculateLinearTicks([0, 5], 20);
            expect(ticks.values).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4, 4.2, 4.4, 4.6, 4.8, 5]);
            expect(ticks.extent).toEqual([0, 5]);
            expect(ticks.step).toEqual(0.2);
        });
        it("should return valid ticks for 0-7000 with step of 10", function() {
            var ticks = GOVUK.Insights.calculateLinearTicks([-5, 0], 5);
            expect(ticks.values).toEqual([-5, -4, -3, -2, -1, 0]);
            expect(ticks.extent).toEqual([-5, 0]);
            expect(ticks.step).toEqual(1);
        });
        it("should raise an exception if lower bound is > upper bound", function() {
            expect(function() { GOVUK.Insights.calculateLinearTicks([0, -1], 5)})
                .toThrow(new Error("Upper bound must be larger than lower."));
        });
        it("should raise an exception if lower bound is == upper bound", function() {
            expect(function() { GOVUK.Insights.calculateLinearTicks([0, 0], 5)})
                .toThrow(new Error("Upper bound must be larger than lower."));
        });
    });

    describe("findDateRangeContaining", function () {
        var dates = [new Date(2012, 1, 1), new Date(2012, 1, 8), new Date(2012, 1, 15), new Date(2012, 1, 22)];

        it("should find a date within the first range", function() {
            var dateRange = GOVUK.Insights.findDateRangeContaining(dates, new Date(2012, 1, 3));
            expect(dateRange[0]).toEqual(new Date(2012, 1, 1));
            expect(dateRange[1]).toEqual(new Date(2012, 1, 8));
        });

        it("should find a date within the last range", function() {
            var dateRange = GOVUK.Insights.findDateRangeContaining(dates, new Date(2012, 1, 18));
            expect(dateRange[0]).toEqual(new Date(2012, 1, 15));
            expect(dateRange[1]).toEqual(new Date(2012, 1, 22));
        });

        it("should find a date that's one of the dates defining a date range", function() {
            var dateRange = GOVUK.Insights.findDateRangeContaining(dates, new Date(2012, 1, 8));
            expect(dateRange[0]).toEqual(new Date(2012, 1, 8));
            expect(dateRange[1]).toEqual(new Date(2012, 1, 15));
        });

        it("should find the last date within the last range", function() {
            var dateRange = GOVUK.Insights.findDateRangeContaining(dates, new Date(2012, 1, 22));
            expect(dateRange[0]).toEqual(new Date(2012, 1, 15));
            expect(dateRange[1]).toEqual(new Date(2012, 1, 22));
        });


        it("should fail with a reasonable error if a date is not within range (before the first date)", function() {
            var date = new Date(2011, 12, 1);
            expect(function() {
                GOVUK.Insights.findDateRangeContaining(dates, date)})
                    .toThrow(new Error("Date `" + date + "` is not within a range."));
        });

        it("should fail with a reasonable error if a date is not within range (after the last date)", function() {
            var date = new Date(2012, 2, 1);
            expect(function() {
                GOVUK.Insights.findDateRangeContaining(dates, date)})
                    .toThrow(new Error("Date `" + date + "` is not within a range."));
        });
    });

    describe("findY", function () {
        it("should find a value in a simple one element array", function () {
            var y = GOVUK.Insights.findY([{x: 0, y: 0}], 0);

            expect(y).toEqual(0);
        });

        it("should find a value in a two element element array", function () {
            var y = GOVUK.Insights.findY([{x: 0, y: 0}, {x: 1, y: 1}], 1);

            expect(y).toEqual(1);
        });
    });

    describe("interpolateY", function () {
        it("should return the y coordinate for a given x included between two known points", function () {
           expect(GOVUK.Insights.interpolateY(5, {x: 0, y: 0}, {x: 10, y: 10})).toEqual(5);
           expect(GOVUK.Insights.interpolateY(5, {x: 0, y: 0}, {x: 10, y: 0})).toEqual(0);
           expect(GOVUK.Insights.interpolateY(12, {x: 10, y: 10}, {x: 20, y: 15})).toEqual(11);
           expect(GOVUK.Insights.interpolateY(15, {x: 10, y: 10}, {x: 20, y: 15})).toEqual(12.5);
           expect(GOVUK.Insights.interpolateY(15, {x: 20, y: 20}, {x: 10, y: 10})).toEqual(15);
        });
    });
});
