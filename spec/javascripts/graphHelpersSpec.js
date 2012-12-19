describe("Helpers", function () {
    describe("numericLabelFormatterFor", function() {
        describe("max value of 1000", function() {
            beforeEach(function() {
                this.formatter = GOVUK.Insights.numericLabelFormatterFor(1000);
            });
            it("should return 0 for 0", function() {
                expect(this.formatter(0)).toBe("0");
            });
            it("should return 0.4k for 400", function() {
                expect(this.formatter(400)).toBe("0.4k");
            });
            it("should return 1.5k for 1500", function() {
                expect(this.formatter(1500)).toBe("1.5k");
            });
        });

        describe("max value of 1000000", function() {
            beforeEach(function() {
                this.formatter = GOVUK.Insights.numericLabelFormatterFor(1000000);
            });
            it("should return 0 for 0", function() {
                expect(this.formatter(0)).toBe("0");
            });
            it("should return 0.1m for 5000", function() {
                expect(this.formatter(5000)).toBe("0.1m");
            });
            it("should return 1.5m for 150000", function() {
                expect(this.formatter(1500000)).toBe("1.5m");
            });
        });
    });
    describe("formatNumericLabel", function() {
        it("should display entire numbers from 0 to 499", function() {
            expect(GOVUK.Insights.formatNumericLabel(0)).toBe('0');
            expect(GOVUK.Insights.formatNumericLabel(1)).toBe('1');
            expect(GOVUK.Insights.formatNumericLabel(9)).toBe('9');
            expect(GOVUK.Insights.formatNumericLabel(10)).toBe('10');
            expect(GOVUK.Insights.formatNumericLabel(77)).toBe('77');
            expect(GOVUK.Insights.formatNumericLabel(100)).toBe('100');
            expect(GOVUK.Insights.formatNumericLabel(398)).toBe('398');
            expect(GOVUK.Insights.formatNumericLabel(499)).toBe('499');
        });

        it("should display numbers from 500 to 499499 as fractions of 1k", function() {
            expect(GOVUK.Insights.formatNumericLabel(500)).toBe('0.50k');
            expect(GOVUK.Insights.formatNumericLabel(777)).toBe('0.78k');
            expect(GOVUK.Insights.formatNumericLabel(994)).toBe('0.99k');
            expect(GOVUK.Insights.formatNumericLabel(995)).toBe('1.00k');
            expect(GOVUK.Insights.formatNumericLabel(996)).toBe('1.00k');
            expect(GOVUK.Insights.formatNumericLabel(999)).toBe('1.00k');
            expect(GOVUK.Insights.formatNumericLabel(1000)).toBe('1.00k');
            expect(GOVUK.Insights.formatNumericLabel(1005)).toBe('1.01k');
            expect(GOVUK.Insights.formatNumericLabel(1006)).toBe('1.01k');
            expect(GOVUK.Insights.formatNumericLabel(100000)).toBe('100k');
            expect(GOVUK.Insights.formatNumericLabel(234568)).toBe('235k');
            expect(GOVUK.Insights.formatNumericLabel(499499)).toBe('499k');
        });

        it("should display numbers from 499500 and above as fractions of 1m", function() {
            expect(GOVUK.Insights.formatNumericLabel(499500)).toBe('0.50m');
            expect(GOVUK.Insights.formatNumericLabel(500000)).toBe('0.50m');
            expect(GOVUK.Insights.formatNumericLabel(777777)).toBe('0.78m');
            expect(GOVUK.Insights.formatNumericLabel(994499)).toBe('0.99m');
            expect(GOVUK.Insights.formatNumericLabel(994599)).toBe('1.00m');
//            expect(GOVUK.Insights.formatNumericLabel(994999)).toBe('0.99m');
            expect(GOVUK.Insights.formatNumericLabel(995000)).toBe('1.00m');
            expect(GOVUK.Insights.formatNumericLabel(995001)).toBe('1.00m');
            expect(GOVUK.Insights.formatNumericLabel(999900)).toBe('1.00m');
            expect(GOVUK.Insights.formatNumericLabel(1000000)).toBe('1.00m');
            expect(GOVUK.Insights.formatNumericLabel(1005000)).toBe('1.01m');
            expect(GOVUK.Insights.formatNumericLabel(1005001)).toBe('1.01m');
            expect(GOVUK.Insights.formatNumericLabel(100000000)).toBe('100m');
            expect(GOVUK.Insights.formatNumericLabel(234568234)).toBe('235m');
            expect(GOVUK.Insights.formatNumericLabel(499499499)).toBe('499m');
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