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

    describe("Collision Rectangle", function () {
        it("should initialize from a SVGRectangle", function () {
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            var aRectangle = svg.createSVGRect();

            aRectangle.x = 10;
            aRectangle.y = 10;
            aRectangle.height = 25;
            aRectangle.width = 25;

            var collisionRectangle = new GOVUK.Insights.geometry.CollisionBox(aRectangle);

            expect(collisionRectangle.top).toBe(10);
            expect(collisionRectangle.bottom).toBe(35);
            expect(collisionRectangle.left).toBe(10);
            expect(collisionRectangle.right).toBe(35);
        });

        it("should calculate the center", function () {
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            var aRectangle = svg.createSVGRect();

            aRectangle.x = 0;
            aRectangle.y = 0;
            aRectangle.height = 50;
            aRectangle.width = 50;

            var collisionRectangle = new GOVUK.Insights.geometry.CollisionBox(aRectangle);

            expect(collisionRectangle.center.x).toBe(25);
            expect(collisionRectangle.center.y).toBe(25);
        });

        it("should detect collisions with other boxes", function () {
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            var aRectangle = svg.createSVGRect();
            var anotherRectangle = svg.createSVGRect();
            var yetAnotherRectangle = svg.createSVGRect();

            aRectangle.x = 0;
            aRectangle.y = 0;
            aRectangle.height = 50;
            aRectangle.width = 50;

            anotherRectangle.x = 10;
            anotherRectangle.y = 10;
            anotherRectangle.height = 60;
            anotherRectangle.width = 60;

            yetAnotherRectangle.x = 60;
            yetAnotherRectangle.y = 60;
            yetAnotherRectangle.height = 10;
            yetAnotherRectangle.width = 10;

            var aBox = new GOVUK.Insights.geometry.CollisionBox(aRectangle)
            var anotherBox = new GOVUK.Insights.geometry.CollisionBox(anotherRectangle)
            var yetAnotherBox = new GOVUK.Insights.geometry.CollisionBox(yetAnotherRectangle)

            expect(aBox.collidesWith(anotherBox)).toBeTruthy();
            expect(aBox.collidesWith(yetAnotherBox)).toBeFalsy();
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