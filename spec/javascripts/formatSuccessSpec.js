describe("format success graph", function () {
    var stubGraphDiv = $('<div id="format-success-module"><div id="format-success"></div></div>');

    var jsonResponse = {};
    var stubAjaxResponder = function (successFunction) {
        successFunction(jsonResponse);
    }

    beforeEach(function () {
        jsonResponse = [
            { "format": "Guide", "entries" : 1000, "percentage_of_success": 50 },
            { "format": "Transaction", "entries": 40000, "percentage_of_success": 20},
            { "format": "Quick Answers", "entries": 100000, "percentage_of_success": 85}
        ];

        // clone every time to avoid state in tests
        stubGraphDiv.clone().appendTo('body');
        spyOn(jQuery, 'ajax').andCallFake(function (options) {
            stubAjaxResponder(options.success);
        });
    });

    afterEach(function () {
        $('#format-success-module').remove();
        jQuery.ajax.reset();
    });

    it("should generate an svg graph from json data", function () {
        GOVUK.Insights.formatSuccess();

        expect(jQuery.ajax).toHaveBeenCalled();

        var svg = $('#format-success-module').find('svg');
        expect(svg.length).not.toBe(0);
    });

    it("should display a png instead of a graph is svgs are not supported", function () {
        spyOn(GOVUK, "isSvgSupported").andReturn(false);

        GOVUK.Insights.formatSuccess();

        expect(jQuery.ajax).toHaveBeenCalled();

        var png = $('#format-success-module').find('img');
        expect(png.length).not.toBe(0);
    });

    it("should display an error message if there is no data to be shown", function () {
        jsonResponse = null;

        // assuming the jasmine spec browser will support svgs but just to be safe...
        spyOn(GOVUK, "isSvgSupported").andReturn(true);

        GOVUK.Insights.formatSuccess();

        expect(jQuery.ajax).toHaveBeenCalled();

        var actualErrorMsg = $('#format-success-module').find('#error-msg').text();
        var expectedErrorMsg = $(GOVUK.Insights.Helpers.error_div).text();

        expect(actualErrorMsg).toBe(expectedErrorMsg);

    });
});
