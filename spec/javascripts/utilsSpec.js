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

            expect(colour.red).toBe(5 * 5 / 255);
            expect(colour.blue).toBe(7 * 7 / 255);
            expect(colour.green).toBe(6 * 6 / 255);
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

        it("should detect if a point is inside of a box", function () {
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            var aRectangle = svg.createSVGRect();

            aRectangle.x = 0;
            aRectangle.y = 0;
            aRectangle.height = 50;
            aRectangle.width = 50;

            var pointInsideTheRectangle = {x: 15, y: 15};
            var pointOutsideOfTheRectangle = {x: 100, y: 100};

            var aBox = new GOVUK.Insights.geometry.CollisionBox(aRectangle);

            expect(aBox.containsPoint(pointInsideTheRectangle)).toBeTruthy();
            expect(aBox.containsPoint(pointOutsideOfTheRectangle)).toBeFalsy();
        });
    });


});