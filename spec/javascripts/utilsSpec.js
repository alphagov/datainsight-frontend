describe("Data Insight utility functions", function () {

    describe("String extensions", function () {
        it("should remove all bad characters", function () {
            var testString = "%^&&foo";

            expect(testString.idify()).toBe("foo");
        });

        it("should replace whitespaces with dash '-' ", function () {
            var testString = "a\t\n b\tc\nd e";

            expect(testString.idify()).toBe("a-b-c-d-e");

        })

        it("should make a lower case version", function () {
            var testString = "WARNING!";

            expect(testString.idify()).toBe('warning');
        })

        it("should take care of german umlauts", function () {
            var testString = "Änderungs Vereinbarung"

            expect(testString.idify()).toBe("nderungs-vereinbarung");
        });
    });

    describe("hour conversion", function () {
        var convert = GOVUK.Insights.convertTo12HourTime;
        
        it("should convert 24 hour time to 12 hour time", function () {
            expect(convert(13)).toBe("1pm");
            expect(convert(00)).toBe("12am");
            expect(convert(10)).toBe("10am");
            expect(convert(24)).toBe("12am");
        });
    });
});