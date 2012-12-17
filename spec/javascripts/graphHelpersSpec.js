describe("Helpers", function () {
    describe("numericLabelFormatterFor", function() {
        describe("tick step of 1000", function() {
            it("should return 0 for 0", function() {
                expect(GOVUK.Insights.numericLabelFormatterFor(1000)(0)).toBe("0");
            });
            it("should return 1k for 400", function() {
                expect(GOVUK.Insights.numericLabelFormatterFor(1000)(400)).toBe("1k");
            });
            it("should return 2k for 1500", function() {
                expect(GOVUK.Insights.numericLabelFormatterFor(1000)(1500)).toBe("2k");
            });
        });

        describe("tick step of 1000000", function() {
            it("should return 0 for 0", function() {
                expect(GOVUK.Insights.numericLabelFormatterFor(1000000)(0)).toBe("0");
            });
            it("should return 0.1m for 5000", function() {
                expect(GOVUK.Insights.numericLabelFormatterFor(1000000)(5000)).toBe("0.1m");
            });
            it("should return 1.5m for 150000", function() {
                expect(GOVUK.Insights.numericLabelFormatterFor(1000000)(1500000)).toBe("1.5m");
            });
        })
    });
    describe("formatNumericLabel", function() {
        it("should convert 1 000 000 to 1m", function () {
            var number = 1000000;

            var label = GOVUK.Insights.formatNumericLabel(number);

            expect(label).toBe("1.00m");
        });

        it("should convert 10,000 to 10k", function () {
           var number = 10000;

            expect(GOVUK.Insights.formatNumericLabel(number)).toBe("10k");
        });

        it("should keep 100", function () {
            var number = 100;

            expect(GOVUK.Insights.formatNumericLabel(number)).toBe("100");
        });

        it("should display millions to two decimal places", function () {
            var onePointFiveMillion = 5500000;
            var onePointFiveMillionAndOneOneOneOneOne = 1511111;

            expect(GOVUK.Insights.formatNumericLabel(onePointFiveMillion)).toBe('5.50m');
            expect(GOVUK.Insights.formatNumericLabel(onePointFiveMillionAndOneOneOneOneOne)).toBe('1.51m');
        });

        it("should not display decimal place when it would be zero", function() {
            expect(GOVUK.Insights.formatNumericLabel(7002)).toBe('7k');
        });

        it("should not use decimal places for ten million or greater", function () {
            var tenPointFiveMillion = 10500000;

            expect(GOVUK.Insights.formatNumericLabel(tenPointFiveMillion)).toBe('11m');
        });

        it("should display thousands to one decimal place", function () {
            var onePointFiveThousand = 1500;
            var onePointFiveThousandAndOneOne = 1511;

            expect(GOVUK.Insights.formatNumericLabel(onePointFiveThousand)).toBe('1.5k');
            expect(GOVUK.Insights.formatNumericLabel(onePointFiveThousandAndOneOne)).toBe('1.5k');
        });

        it("should not use decimal places for ten thousand or greater", function () {
            var tenPointFiveThousand = 10500;

            expect(GOVUK.Insights.formatNumericLabel(tenPointFiveThousand)).toBe('11k');
        });

        it("should work for the following edge cases", function () {
            var fiftyFivePointFiveThousand = 55500;
            var fiftyFivePointFourThousand = 55400;
            var ninetyNinePointNineThousand = 99900;

            var fiftyFivePointFiveMillion = 55500000;
            var fiftyFivePointFourMillion = 55400000;
            var ninetyNinePointNineMillion = 99900000;

            expect(GOVUK.Insights.formatNumericLabel(fiftyFivePointFiveThousand)).toBe('56k');
            expect(GOVUK.Insights.formatNumericLabel(fiftyFivePointFourThousand)).toBe('55k');
            expect(GOVUK.Insights.formatNumericLabel(ninetyNinePointNineThousand)).toBe('100k');

            expect(GOVUK.Insights.formatNumericLabel(fiftyFivePointFiveMillion)).toBe('56m');
            expect(GOVUK.Insights.formatNumericLabel(fiftyFivePointFourMillion)).toBe('55m');
            expect(GOVUK.Insights.formatNumericLabel(ninetyNinePointNineMillion)).toBe('100m');

            expect(GOVUK.Insights.formatNumericLabel(9999)).toBe('10k');
            expect(GOVUK.Insights.formatNumericLabel(999499)).toBe('999k');
            expect(GOVUK.Insights.formatNumericLabel(999500)).toBe('1.00m');
            expect(GOVUK.Insights.formatNumericLabel(999999)).toBe('1.00m');
            expect(GOVUK.Insights.formatNumericLabel(9999999)).toBe('10.00m');
        });

        it("should not show .0 for values rounding to an integer number of thousands", function () {
            expect(GOVUK.Insights.formatNumericLabel(7949)).toBe('7.9k');
            expect(GOVUK.Insights.formatNumericLabel(7950)).toBe('8k');
            expect(GOVUK.Insights.formatNumericLabel(8049)).toBe('8k');
            expect(GOVUK.Insights.formatNumericLabel(8050)).toBe('8.1k');
        });

        it("should display entirely numbers from 0 to 100", function() {
            expect(GOVUK.Insights.formatNumericLabel(0)).toBe('0');
            expect(GOVUK.Insights.formatNumericLabel(1)).toBe('1');
            expect(GOVUK.Insights.formatNumericLabel(9)).toBe('9');
            expect(GOVUK.Insights.formatNumericLabel(10)).toBe('10');
            expect(GOVUK.Insights.formatNumericLabel(77)).toBe('77');
            expect(GOVUK.Insights.formatNumericLabel(100)).toBe('100');
        });

        it("should display numbers from 101 to 999 as fractions of 1k", function() {
            expect(GOVUK.Insights.formatNumericLabel(101)).toBe('101');
            expect(GOVUK.Insights.formatNumericLabel(154)).toBe('154');
            expect(GOVUK.Insights.formatNumericLabel(235)).toBe('235');
            expect(GOVUK.Insights.formatNumericLabel(398)).toBe('398');
            expect(GOVUK.Insights.formatNumericLabel(777)).toBe('777');
            expect(GOVUK.Insights.formatNumericLabel(999)).toBe('999');
        });
        
        describe("rounding changes", function () {
           it("should now show millions to two decimal places", function () {
               expect(GOVUK.Insights.formatNumericLabel(1220000)).toBe("1.22m");
           });
           
           it("should show all millions to two decimal places", function () {
               expect(GOVUK.Insights.formatNumericLabel(1000000)).toBe("1.00m");
               expect(GOVUK.Insights.formatNumericLabel(1010000)).toBe("1.01m");
               expect(GOVUK.Insights.formatNumericLabel(9099000)).toBe("9.10m");
               expect(GOVUK.Insights.formatNumericLabel(1009900)).toBe("1.01m");
           })
        });
    });

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