describe("String helpers", function() {
    describe("String extensions", function () {
        it("should remove all bad characters", function () {
            var testString = "%^&&foo";

            expect(testString.idify()).toBe("foo");
        });

        it("should replace whitespaces with dash '-' ", function () {
            var testString = "a\t\n b\tc\nd e";

            expect(testString.idify()).toBe("a-b-c-d-e");

        });

        it("should make a lower case version", function () {
            var testString = "WARNING!";

            expect(testString.idify()).toBe('warning');
        });

        it("should take care of german umlauts", function () {
            var testString = "Änderungs Vereinbarung"

            expect(testString.idify()).toBe("nderungs-vereinbarung");
        });
    });
});