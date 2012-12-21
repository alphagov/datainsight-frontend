describe("utils", function() {
	describe("createGettersAndSetters", function() {
		beforeEach(function() {
			this.config = {one: "foo", two: "bar"};
			this.instance = {};
			GOVUK.Insights.utils.createGettersAndSetters(this.config, this.instance);
		});

		it("should get a default value", function() {
			expect(this.instance.one()).toEqual("foo");
			expect(this.instance.two()).toEqual("bar");

		});

		it("should set a new value", function() {
			this.instance.one("two");
			this.instance.two("three");

			expect(this.instance.one()).toEqual("two");
			expect(this.instance.two()).toEqual("three");
		});

		it("should not create getters and setters unless the name is in the config", function() {
			expect(this.instance.three).toBe(undefined);
		});
	});
});