describe("Helpers", function () {
    describe("labelFormatter", function() {
        describe("tick step of 1000", function() {
            it("should return 0 for 0", function() {
                expect(GOVUK.Insights.labelFormatter(1000)(0)).toBe("0");
            });
            it("should return 1k for 400", function() {
                expect(GOVUK.Insights.labelFormatter(1000)(400)).toBe("1k");
            });
            it("should return 2k for 1500", function() {
                expect(GOVUK.Insights.labelFormatter(1000)(1500)).toBe("2k");
            });
        });

        describe("tick step of 1000000", function() {
            it("should return 0 for 0", function() {
                expect(GOVUK.Insights.labelFormatter(1000000)(0)).toBe("0");
            });
            it("should return 1m for 5000", function() {
                expect(GOVUK.Insights.labelFormatter(1000000)(5000)).toBe("1m");
            });
            it("should return 2m for 150000", function() {
                expect(GOVUK.Insights.labelFormatter(1000000)(1500000)).toBe("2m");
            });
        })
    });
    describe("convertToLabel", function() {
        it("should convert 1 000 000 to 1m", function () {
            var number = 1000000;

            var label = GOVUK.Insights.convertToLabel(number);

            expect(label).toBe("1m");
        });

        it("should convert 10,000 to 10k", function () {
           var number = 10000;

            expect(GOVUK.Insights.convertToLabel(number)).toBe("10k");
        });

        it("should keep 100", function () {
            var number = 100;

            expect(GOVUK.Insights.convertToLabel(number)).toBe("100");
        });

        it("should display millions to one decimal place", function () {
            var onePointFiveMillion = 1500000;
            var onePointFiveMillionAndOneOneOneOneOne = 1511111;

            expect(GOVUK.Insights.convertToLabel(onePointFiveMillion)).toBe('1.5m');
            expect(GOVUK.Insights.convertToLabel(onePointFiveMillionAndOneOneOneOneOne)).toBe('1.5m');
        });

        it("should not use decimal places for ten million or greater", function () {
            var tenPointFiveMillion = 10500000;

            expect(GOVUK.Insights.convertToLabel(tenPointFiveMillion)).toBe('11m');
        });

        it("should display thousands to one decimal place", function () {
            var onePointFiveThousand = 1500;
            var onePointFiveThousandAndOneOne = 1511;

            expect(GOVUK.Insights.convertToLabel(onePointFiveThousand)).toBe('1.5k');
            expect(GOVUK.Insights.convertToLabel(onePointFiveThousandAndOneOne)).toBe('1.5k');
        });

        it("should not use decimal places for ten thousand or greater", function () {
            var tenPointFiveThousand = 10500;

            expect(GOVUK.Insights.convertToLabel(tenPointFiveThousand)).toBe('11k');
        });

        it("should work for the following edge cases", function () {
            var fiftyFivePointFiveThousand = 55500;
            var fiftyFivePointFourThousand = 55400;
            var ninetyNinePointNineThousand = 99900;

            var fiftyFivePointFiveMillion = 55500000;
            var fiftyFivePointFourMillion = 55400000;
            var ninetyNinePointNineMillion = 99900000;

            expect(GOVUK.Insights.convertToLabel(fiftyFivePointFiveThousand)).toBe('56k');
            expect(GOVUK.Insights.convertToLabel(fiftyFivePointFourThousand)).toBe('55k');
            expect(GOVUK.Insights.convertToLabel(ninetyNinePointNineThousand)).toBe('100k');

            expect(GOVUK.Insights.convertToLabel(fiftyFivePointFiveMillion)).toBe('56m');
            expect(GOVUK.Insights.convertToLabel(fiftyFivePointFourMillion)).toBe('55m');
            expect(GOVUK.Insights.convertToLabel(ninetyNinePointNineMillion)).toBe('100m');
        });
    });
    describe("calculateLinearTicks", function() {
        it("should return valid ticks for 0-7000 with step of 5", function() {
            var ticks = GOVUK.Insights.calculateLinearTicks([0, 7000], 5);
            expect(ticks.values).toEqual([0, 2000, 4000, 6000, 8000]);
            expect(ticks.extent).toEqual([0, 8000]);
            expect(ticks.step).toEqual(2000);
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