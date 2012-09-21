describe("visits graph generation", function () {

    var stubGraphDiv = $('<div id="visits-module"><img src="https://www.google.com/images/srpr/logo3w.png" /><div class="datainsight-hidden" id="hidden-stuff"><span id="live_at"></span><div id="visits"></div>I am all invisible and stuff</div></div>');

    var jsonResponse = {"govuk":[
        {"date":"2012-03-02", "value":1136},
        {"date":"2012-03-09", "value":773},
        {"date":"2012-03-16", "value":541},
        {"date":"2012-03-23", "value":964},
        {"date":"2012-03-30", "value":875},
        {"date":"2012-04-06", "value":615},
        {"date":"2012-04-13", "value":1046},
        {"date":"2012-04-20", "value":1107},
        {"date":"2012-04-27", "value":920},
        {"date":"2012-05-04", "value":1202},
        {"date":"2012-05-11", "value":1294},
        {"date":"2012-05-18", "value":908},
        {"date":"2012-05-25", "value":1449},
        {"date":"2012-06-01", "value":641},
        {"date":"2012-06-08", "value":591},
        {"date":"2012-06-15", "value":4273880},
        {"date":"2012-06-22", "value":4993463},
        {"date":"2012-06-29", "value":4383256},
        {"date":"2012-07-06", "value":4618603},
        {"date":"2012-07-13", "value":4770964},
        {"date":"2012-07-20", "value":4779488},
        {"date":"2012-07-27", "value":4149617},
        {"date":"2012-08-03", "value":2500000},
        {"date":"2012-08-10", "value":4035591},
        {"date":"2012-08-17", "value":4675732},
        {"date":"2012-08-24", "value":4384813},
        {"date":"2012-08-31", "value":4377346}
    ], "directgov":[
        {"date":"2012-03-02", "value":3469325},
        {"date":"2012-03-09", "value":3908845},
        {"date":"2012-03-16", "value":2901610},
        {"date":"2012-03-23", "value":3226377},
        {"date":"2012-03-30", "value":3946037},
        {"date":"2012-04-06", "value":3927795},
        {"date":"2012-04-13", "value":2109663},
        {"date":"2012-04-20", "value":3105882},
        {"date":"2012-04-27", "value":3060759},
        {"date":"2012-05-04", "value":3581153},
        {"date":"2012-05-11", "value":3965265},
        {"date":"2012-05-18", "value":3026279},
        {"date":"2012-05-25", "value":3664606},
        {"date":"2012-06-01", "value":3676194},
        {"date":"2012-06-08", "value":2423538},
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
    ], "businesslink":[
        {"date":"2012-03-02", "value":357480},
        {"date":"2012-03-09", "value":251644},
        {"date":"2012-03-16", "value":361594},
        {"date":"2012-03-23", "value":248138},
        {"date":"2012-03-30", "value":362384},
        {"date":"2012-04-06", "value":187217},
        {"date":"2012-04-13", "value":158674},
        {"date":"2012-04-20", "value":214487},
        {"date":"2012-04-27", "value":257709},
        {"date":"2012-05-04", "value":392708},
        {"date":"2012-05-11", "value":371306},
        {"date":"2012-05-18", "value":292149},
        {"date":"2012-05-25", "value":190155},
        {"date":"2012-06-01", "value":311037},
        {"date":"2012-06-08", "value":214856},
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
    ], "highlight_spikes":true, "highlight_troughs":false};

    var stubAjaxResponder = function (success) {
        success(jsonResponse);
    }

    beforeEach(function () {
        stubGraphDiv.clone().appendTo('body');
        spyOn(jQuery, 'ajax').andCallFake(function (options) {
            stubAjaxResponder(options.success);
        });
    });

    afterEach(function () {
        $('#visits-module').remove();
        jQuery.ajax.reset();
    });

    it("should hide image, show graph titles and generate an svg graph from json data", function () {
        GOVUK.Insights.visits();

        expect(jQuery.ajax).toHaveBeenCalled();

        var svg = $('#visits-module').find('svg');
        var img = $('#visits-module').find('img');

        expect(svg.length).not.toBe(0);
        expect($('#hidden-stuff').hasClass('datainsight-hidden')).toBeFalsy();
        expect(img.length).toBe(0);
    });

    it("should remove the png instead if svgs are not supported", function () {
        spyOn(GOVUK, "isSvgSupported").andReturn(false);

        GOVUK.Insights.visits();

        expect(jQuery.ajax).toHaveBeenCalled();

        var png = $('#visits-module').find('img');
        expect(png.length).not.toBe(0);
    });

    it("should display a png instead of a graph if svgs are not supported", function () {
        spyOn(GOVUK, "isSvgSupported").andReturn(false);

        GOVUK.Insights.visits();

        expect(jQuery.ajax).toHaveBeenCalled();

        var png = $('#visits-module').find('img');
        expect(png.length).not.toBe(0);
    });

    it("should display an error message if there is no data to be shown", function () {
        jsonResponse = null;

        // assuming the jasmine spec browser will support svgs but just to be safe...
        spyOn(GOVUK, "isSvgSupported").andReturn(true);

        GOVUK.Insights.visits();

        expect(jQuery.ajax).toHaveBeenCalled();

        var actualErrorMsg = $('#visits').find('#error-msg').text();
        var expectedErrorMsg = $(GOVUK.Insights.Helpers.error_div).text();

        expect(actualErrorMsg).toBe(expectedErrorMsg);

    });


});