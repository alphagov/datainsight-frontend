describe("geometry helpers", function () {
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

    describe("clamp function", function () {
        it("should clamp a a value to a given range", function () {
            expect(GOVUK.Insights.clamp(10, 4, 6)).toBe(6);
            expect(GOVUK.Insights.clamp(1, 4, 6)).toBe(4);
            expect(GOVUK.Insights.clamp(10, 4, 16)).toBe(10);
        });

    })

    describe("point", function () {

        var point = GOVUK.Insights.point;

        it("should create a point with coordinates", function () {
            var p = point(123, 456);
            expect(p.x()).toBe(123);
            expect(p.y()).toBe(456);
        });

        it("should create a point with coordinates array", function () {
            var p = point([123, 456]);
            expect(p.x()).toBe(123);
            expect(p.y()).toBe(456);
        });

        it("should return the distance from another point", function () {
            var p = point(10, 10);

            expect(p.distanceFrom(p)).toBe(0);
            expect(p.distanceFrom(point(20, 10))).toBe(10);
            expect(p.distanceFrom(point(10, 20))).toBe(10);
            expect(p.distanceFrom(point(11, 11))).toBeCloseTo(1.4142, 4);
            expect(p.distanceFrom(point(0, 0))).toBeCloseTo(14.1421, 4);

        });

    });
});