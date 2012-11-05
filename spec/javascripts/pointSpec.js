describe("point", function () {

    var point = GOVUK.Insights.point;

    it("should create a point with coordinates", function() {
        var p = point(123, 456);
        expect(p.x()).toBe(123);
        expect(p.y()).toBe(456);
    });

    it("should create a point with coordinates array", function() {
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
        expect(p.distanceFrom(point(0,0))).toBeCloseTo(14.1421, 4);

    });

});