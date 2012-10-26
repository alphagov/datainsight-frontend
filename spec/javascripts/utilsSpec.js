describe("Data Insight utility functions", function () {

    describe("hex color functions", function () {

        it("should convert from hex to RGB", function () {
           var colour1 = new GOVUK.Insights.colors('#ff00ff');
           var colour2 = new GOVUK.Insights.colors('#030201');

           expect(colour1.red).toBe(255);
           expect(colour1.green).toBe(0);
           expect(colour1.blue).toBe(255);

           expect(colour2.red).toBe(3);
           expect(colour2.green).toBe(2);
           expect(colour2.blue).toBe(1);

        });

        it("should darken a colour by a set amount", function () {
           var colour = new GOVUK.Insights.colors('#050607');
           colour.multiplyWithSelf();

           expect(colour.red).toBe(5*5 / 255);
           expect(colour.blue).toBe(7*7 / 255);
           expect(colour.green).toBe(6*6 / 255);
        });

        it("should convert to css notation", function () {
           var colour1 = new GOVUK.Insights.colors('#050505');
           var colour2 = new GOVUK.Insights.colors('#050505');

           colour1.green = 255;

           colour2.red = 0;
           colour2.green = 0;
           colour2.blue = 0;

           expect(colour1.asCSS()).toBe('#05ff05');
           expect(colour2.asCSS()).toBe('#000000');
        });

        it("should initialize from jQuerys weird rgb notation", function () {
            var colour1 = new GOVUK.Insights.colors('rgb(14, 15, 16)');

            expect(colour1.red).toBe(14);
            expect(colour1.green).toBe(15);
            expect(colour1.blue).toBe(16);
        });

        it("should return nicely chaining functions", function () {
           var colour = new GOVUK.Insights.colors('#151515');

           expect(colour.multiplyWithSelf().asCSS()).toBe('#010101');
        });

    });

    describe("String extensions", function () {
       it("should remove all bad characters", function () {
           var testString = "%^&&foo";

           expect(testString.idify()).toBe("foo");
       });

        it("should replace whitespaces with dash '-' ", function(){
            var testString = "a\t\n b\tc\nd e";

            expect(testString.idify()).toBe("a-b-c-d-e");

        })

        it("should make a lower case version", function(){
            var testString = "WARNING!";

            expect(testString.idify()).toBe('warning');
        })

        it("should take care of german umlauts", function(){
            var testString = "Änderungs Vereinbarung"

            expect(testString.idify()).toBe("nderungs-vereinbarung");
        });
    });


});