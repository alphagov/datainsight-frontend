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
});
