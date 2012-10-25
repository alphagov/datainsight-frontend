describe("Helpers", function () {
    describe("convertToLabel", function() {
        it("should convert 1 000 000 to 1m", function () {
            var number = 1000000;

            var label = GOVUK.convertToLabel(number);

            expect(label).toBe("1m");
        });

        it("should convert 10,000 to 10k", function () {
           var number = 10000;

            expect(GOVUK.convertToLabel(number)).toBe("10k");
        });

        it("should keep 100", function () {
            var number = 100;

            expect(GOVUK.convertToLabel(number)).toBe("100");
        });

        it("should display millions to one decimal place", function () {
            var onePointFiveMillion = 1500000;
            var onePointFiveMillionAndOneOneOneOneOne = 1511111;

            expect(GOVUK.convertToLabel(onePointFiveMillion)).toBe('1.5m');
            expect(GOVUK.convertToLabel(onePointFiveMillionAndOneOneOneOneOne)).toBe('1.5m');
        });

        it("should not use decimal places for ten million or greater", function () {
            var tenPointFiveMillion = 10500000;

            expect(GOVUK.convertToLabel(tenPointFiveMillion)).toBe('11m');
        });

        it("should display thousands to one decimal place", function () {
            var onePointFiveThousand = 1500;
            var onePointFiveThousandAndOneOne = 1511;

            expect(GOVUK.convertToLabel(onePointFiveThousand)).toBe('1.5k');
            expect(GOVUK.convertToLabel(onePointFiveThousandAndOneOne)).toBe('1.5k');
        });

        it("should not use decimal places for ten thousand or greater", function () {
            var tenPointFiveThousand = 10500;

            expect(GOVUK.convertToLabel(tenPointFiveThousand)).toBe('11k');
        });

        it("should work for the following edge cases", function () {
            var fiftyFivePointFiveThousand = 55500;
            var fiftyFivePointFourThousand = 55400;
            var ninetyNinePointNineThousand = 99900;

            var fiftyFivePointFiveMillion = 55500000;
            var fiftyFivePointFourMillion = 55400000;
            var ninetyNinePointNineMillion = 99900000;

            expect(GOVUK.convertToLabel(fiftyFivePointFiveThousand)).toBe('56k');
            expect(GOVUK.convertToLabel(fiftyFivePointFourThousand)).toBe('55k');
            expect(GOVUK.convertToLabel(ninetyNinePointNineThousand)).toBe('100k');

            expect(GOVUK.convertToLabel(fiftyFivePointFiveMillion)).toBe('56m');
            expect(GOVUK.convertToLabel(fiftyFivePointFourMillion)).toBe('55m');
            expect(GOVUK.convertToLabel(ninetyNinePointNineMillion)).toBe('100m');
        });
    });
});