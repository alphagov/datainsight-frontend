describe("visits graph generation", function () {

    var stubGraphDiv = $('<div id="visits-module"><img src="https://www.google.com/images/srpr/logo3w.png" /><div class="datainsight-hidden" id="hidden-stuff"><div id="visits"></div>I am all invisible and stuff</div></div>');

    var jsonResponse = {
        "response_info":{
            "status":"ok"
        },
        "web_url":"http://datainsight-frontend.dev.gov.uk/performance/dashboard/visits",
        "id":"http://datainsight-frontend.dev.gov.uk/performance/dashboard/visits.json",
        "details":{
            "sources":[
                "Google Analytics"
            ],
            "data":[
                {
                    "start_at":"2012-03-02",
                    "value":{
                        "directgov":3469325,
                        "govuk":1136,
                        "businesslink":357480
                    },
                    "end_at":"2012-03-09"
                },
                {
                    "start_at":"2012-03-09",
                    "value":{
                        "directgov":3908845,
                        "govuk":773,
                        "businesslink":251644
                    },
                    "end_at":"2012-03-16"
                },
                {
                    "start_at":"2012-03-16",
                    "value":{
                        "directgov":2901610,
                        "govuk":541,
                        "businesslink":361594
                    },
                    "end_at":"2012-03-23"
                },
                {
                    "start_at":"2012-03-23",
                    "value":{
                        "directgov":3226377,
                        "govuk":964,
                        "businesslink":248138
                    },
                    "end_at":"2012-03-30"
                },
                {
                    "start_at":"2012-03-30",
                    "value":{
                        "directgov":3946037,
                        "govuk":875,
                        "businesslink":362384
                    },
                    "end_at":"2012-04-06"
                },
                {
                    "start_at":"2012-04-06",
                    "value":{
                        "directgov":3927795,
                        "govuk":615,
                        "businesslink":187217
                    },
                    "end_at":"2012-04-13"
                },
                {
                    "start_at":"2012-04-13",
                    "value":{
                        "directgov":2109663,
                        "govuk":1046,
                        "businesslink":158674
                    },
                    "end_at":"2012-04-20"
                },
                {
                    "start_at":"2012-04-20",
                    "value":{
                        "directgov":3105882,
                        "govuk":1107,
                        "businesslink":214487
                    },
                    "end_at":"2012-04-27"
                },
                {
                    "start_at":"2012-04-27",
                    "value":{
                        "directgov":3060759,
                        "govuk":920,
                        "businesslink":257709
                    },
                    "end_at":"2012-05-04"
                },
                {
                    "start_at":"2012-05-04",
                    "value":{
                        "directgov":3581153,
                        "govuk":1202,
                        "businesslink":392708
                    },
                    "end_at":"2012-05-11"
                },
                {
                    "start_at":"2012-05-11",
                    "value":{
                        "directgov":3965265,
                        "govuk":1294,
                        "businesslink":371306
                    },
                    "end_at":"2012-05-18"
                },
                {
                    "start_at":"2012-05-18",
                    "value":{
                        "directgov":3026279,
                        "govuk":908,
                        "businesslink":292149
                    },
                    "end_at":"2012-05-25"
                },
                {
                    "start_at":"2012-05-25",
                    "value":{
                        "directgov":3664606,
                        "govuk":1449,
                        "businesslink":190155
                    },
                    "end_at":"2012-06-01"
                },
                {
                    "start_at":"2012-06-01",
                    "value":{
                        "directgov":3676194,
                        "govuk":641,
                        "businesslink":311037
                    },
                    "end_at":"2012-06-08"
                },
                {
                    "start_at":"2012-06-08",
                    "value":{
                        "directgov":2423538,
                        "govuk":591,
                        "businesslink":214856
                    },
                    "end_at":"2012-06-15"
                },
                {
                    "start_at":"2012-06-15",
                    "value":{
                        "directgov":0,
                        "govuk":4273880,
                        "businesslink":0
                    },
                    "end_at":"2012-06-22"
                },
                {
                    "start_at":"2012-06-22",
                    "value":{
                        "directgov":0,
                        "govuk":4993463,
                        "businesslink":0
                    },
                    "end_at":"2012-06-29"
                },
                {
                    "start_at":"2012-06-29",
                    "value":{
                        "directgov":0,
                        "govuk":4383256,
                        "businesslink":0
                    },
                    "end_at":"2012-07-06"
                },
                {
                    "start_at":"2012-07-06",
                    "value":{
                        "directgov":0,
                        "govuk":4618603,
                        "businesslink":0
                    },
                    "end_at":"2012-07-13"
                },
                {
                    "start_at":"2012-07-13",
                    "value":{
                        "directgov":0,
                        "govuk":4770964,
                        "businesslink":0
                    },
                    "end_at":"2012-07-20"
                },
                {
                    "start_at":"2012-07-20",
                    "value":{
                        "directgov":0,
                        "govuk":4779488,
                        "businesslink":0
                    },
                    "end_at":"2012-07-27"
                },
                {
                    "start_at":"2012-07-27",
                    "value":{
                        "directgov":0,
                        "govuk":4149617,
                        "businesslink":0
                    },
                    "end_at":"2012-08-03"
                },
                {
                    "start_at":"2012-08-03",
                    "value":{
                        "directgov":0,
                        "govuk":2500000,
                        "businesslink":0
                    },
                    "end_at":"2012-08-10"
                },
                {
                    "start_at":"2012-08-10",
                    "value":{
                        "directgov":0,
                        "govuk":4035591,
                        "businesslink":0
                    },
                    "end_at":"2012-08-17"
                },
                {
                    "start_at":"2012-08-17",
                    "value":{
                        "directgov":0,
                        "govuk":4675732,
                        "businesslink":0
                    },
                    "end_at":"2012-08-24"
                },
                {
                    "start_at":"2012-08-24",
                    "value":{
                        "directgov":0,
                        "govuk":4384813,
                        "businesslink":0
                    },
                    "end_at":"2012-08-31"
                },
                {
                    "start_at":"2012-08-31",
                    "value":{
                        "directgov":0,
                        "govuk":4377346,
                        "businesslink":0
                    },
                    "end_at":"2012-09-07"
                }
            ]
        }
    };

    var stubAjaxResponder = function (success) {
        success(jsonResponse);
    };

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


})
;