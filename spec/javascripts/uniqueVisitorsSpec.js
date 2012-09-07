describe("unique visitors graph generation", function () {

    var stubGraphDiv = $('<div id="unique-visitors-module"><div id="unique-visitors"></div></div>');

    var jsonResponse = {"directgov":[
        {"date":"2012-03-02", "value":2905962},
        {"date":"2012-03-09", "value":3922413},
        {"date":"2012-03-16", "value":2972456},
        {"date":"2012-03-23", "value":2666208},
        {"date":"2012-03-30", "value":2762708},
        {"date":"2012-04-06", "value":2339548},
        {"date":"2012-04-13", "value":2620268},
        {"date":"2012-04-20", "value":2930597},
        {"date":"2012-04-27", "value":2706090},
        {"date":"2012-05-04", "value":2174276},
        {"date":"2012-05-11", "value":2598573},
        {"date":"2012-05-18", "value":3397429},
        {"date":"2012-05-25", "value":3681284},
        {"date":"2012-06-01", "value":3248936},
        {"date":"2012-06-08", "value":2688198},
        {"date":"2012-06-15", "value":0},
        {"date":"2012-06-22", "value":0},
        {"date":"2012-06-29", "value":0},
        {"date":"2012-07-06", "value":0},
        {"date":"2012-07-13", "value":0},
        {"date":"2012-07-20", "value":0},
        {"date":"2012-07-27", "value":0},
        {"date":"2012-08-03", "value":0},
        {"date":"2012-08-10", "value":0},
        {"date":"2012-08-17", "value":0},
        {"date":"2012-08-24", "value":0},
        {"date":"2012-08-31", "value":0}
    ], "govuk":[
        {"date":"2012-03-02", "value":571},
        {"date":"2012-03-09", "value":1192},
        {"date":"2012-03-16", "value":1268},
        {"date":"2012-03-23", "value":629},
        {"date":"2012-03-30", "value":1075},
        {"date":"2012-04-06", "value":760},
        {"date":"2012-04-13", "value":889},
        {"date":"2012-04-20", "value":1184},
        {"date":"2012-04-27", "value":565},
        {"date":"2012-05-04", "value":686},
        {"date":"2012-05-11", "value":826},
        {"date":"2012-05-18", "value":980},
        {"date":"2012-05-25", "value":620},
        {"date":"2012-06-01", "value":712},
        {"date":"2012-06-08", "value":529},
        {"date":"2012-06-15", "value":4916833},
        {"date":"2012-06-22", "value":4635359},
        {"date":"2012-06-29", "value":4481103},
        {"date":"2012-07-06", "value":4868698},
        {"date":"2012-07-13", "value":4765359},
        {"date":"2012-07-20", "value":4715644},
        {"date":"2012-07-27", "value":4085697},
        {"date":"2012-08-03", "value":2500000},
        {"date":"2012-08-10", "value":2600000},
        {"date":"2012-08-17", "value":2700000},
        {"date":"2012-08-24", "value":2800000},
        {"date":"2012-08-31", "value":2900000}
    ], "businesslink":[
        {"date":"2012-03-02", "value":344162},
        {"date":"2012-03-09", "value":310069},
        {"date":"2012-03-16", "value":355442},
        {"date":"2012-03-23", "value":104717},
        {"date":"2012-03-30", "value":274613},
        {"date":"2012-04-06", "value":256422},
        {"date":"2012-04-13", "value":324976},
        {"date":"2012-04-20", "value":395105},
        {"date":"2012-04-27", "value":321247},
        {"date":"2012-05-04", "value":270920},
        {"date":"2012-05-11", "value":210194},
        {"date":"2012-05-18", "value":329858},
        {"date":"2012-05-25", "value":322748},
        {"date":"2012-06-01", "value":346098},
        {"date":"2012-06-08", "value":233353},
        {"date":"2012-06-15", "value":0},
        {"date":"2012-06-22", "value":0},
        {"date":"2012-06-29", "value":0},
        {"date":"2012-07-06", "value":0},
        {"date":"2012-07-13", "value":0},
        {"date":"2012-07-20", "value":0},
        {"date":"2012-07-27", "value":0},
        {"date":"2012-08-03", "value":0},
        {"date":"2012-08-10", "value":0},
        {"date":"2012-08-17", "value":0},
        {"date":"2012-08-24", "value":0},
        {"date":"2012-08-31", "value":0}
    ], "highlight_troughs":false, "highlight_spikes":true};
    var stubAjaxResponder = function (success) {
        success(jsonResponse);
    }

    beforeEach(function() {
        stubGraphDiv.clone().appendTo('body');
        spyOn(jQuery, 'ajax').andCallFake(function (options) {
            stubAjaxResponder(options.success);
        });
    });

    afterEach(function() {
        $('#unique-visitors-module').remove();
        jQuery.ajax.reset();
    });

    it("should generate an svg graph from json data", function () {
        GOVUK.Insights.uniqueVisitors();

        expect(jQuery.ajax).toHaveBeenCalled();

        var svg = $('#unique-visitors-module').find('svg');
        expect(svg.length).not.toBe(0);
    });

    it("should display a png instead of a graph is svgs are not supported", function () {
        spyOn(GOVUK, "isSvgSupported").andReturn(false);

        GOVUK.Insights.uniqueVisitors();

        expect(jQuery.ajax).toHaveBeenCalled();

        var png = $('#unique-visitors-module').find('img');
        expect(png.length).not.toBe(0);
    });

    it("should replace title text when displaying as a png", function () {
        spyOn(GOVUK,'isSvgSupported').andReturn(false);

        GOVUK.Insights.uniqueVisitors();

        var moduleDiv = $('#unique-visitors-module');

        expect(moduleDiv.children().length).toBe(1);
        expect(moduleDiv.children()[0].nodeName).toBe('IMG');
    });

    it("should display an error message if there is no data to be shown", function () {
        jsonResponse = null;

        // assuming the jasmine spec browser will support svgs but just to be safe...
        spyOn(GOVUK, "isSvgSupported").andReturn(true);

        GOVUK.Insights.uniqueVisitors();

        expect(jQuery.ajax).toHaveBeenCalled();

        var actualErrorMsg = $('#unique-visitors').find('#error-msg').text();
        var expectedErrorMsg = $(GOVUK.Insights.Helpers.error_div).text();

        console.log(actualErrorMsg, expectedErrorMsg);

        expect(actualErrorMsg).toBe(expectedErrorMsg);

    });

});