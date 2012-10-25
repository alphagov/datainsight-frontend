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
});