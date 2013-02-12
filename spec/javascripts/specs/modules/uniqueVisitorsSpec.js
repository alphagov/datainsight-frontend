describe("unique visitors graph generation", function () {

    var stubGraphDiv = $('<div id="unique-visitors-module"><img src="https://www.google.com/images/srpr/logo3w.png" /><div class="datainsight-hidden" id="hidden-stuff"><div id="unique-visitors"></div>I am all invisible and stuff</div></div>');

    var jsonResponse = {
        "response_info": {
            "status": "ok"
        },
        "id": "http://datainsight-frontend.dev.gov.uk/performance/dashboard/unique-visitors.json",
        "details": {
            "sources": [
                "Google Analytics"
            ],
            "data": [
                {
                    "start_at": "2012-03-02",
                    "value": {
                        "directgov": 2905962,
                        "govuk": 571,
                        "businesslink": 344162
                    },
                    "end_at": "2012-03-09"
                },
                {
                    "start_at": "2012-03-09",
                    "value": {
                        "directgov": 3922413,
                        "govuk": 1192,
                        "businesslink": 310069
                    },
                    "end_at": "2012-03-16"
                },
                {
                    "start_at": "2012-03-16",
                    "value": {
                        "directgov": 2972456,
                        "govuk": 1268,
                        "businesslink": 355442
                    },
                    "end_at": "2012-03-23"
                },
                {
                    "start_at": "2012-03-23",
                    "value": {
                        "directgov": 2666208,
                        "govuk": 629,
                        "businesslink": 104717
                    },
                    "end_at": "2012-03-30"
                },
                {
                    "start_at": "2012-03-30",
                    "value": {
                        "directgov": 2762708,
                        "govuk": 1075,
                        "businesslink": 274613
                    },
                    "end_at": "2012-04-06"
                },
                {
                    "start_at": "2012-04-06",
                    "value": {
                        "directgov": 2339548,
                        "govuk": 760,
                        "businesslink": 256422
                    },
                    "end_at": "2012-04-13"
                },
                {
                    "start_at": "2012-04-13",
                    "value": {
                        "directgov": 2620268,
                        "govuk": 889,
                        "businesslink": 324976
                    },
                    "end_at": "2012-04-20"
                },
                {
                    "start_at": "2012-04-20",
                    "value": {
                        "directgov": 2930597,
                        "govuk": 1184,
                        "businesslink": 395105
                    },
                    "end_at": "2012-04-27"
                },
                {
                    "start_at": "2012-04-27",
                    "value": {
                        "directgov": 2706090,
                        "govuk": 565,
                        "businesslink": 321247
                    },
                    "end_at": "2012-05-04"
                },
                {
                    "start_at": "2012-05-04",
                    "value": {
                        "directgov": 2174276,
                        "govuk": 686,
                        "businesslink": 270920
                    },
                    "end_at": "2012-05-11"
                },
                {
                    "start_at": "2012-05-11",
                    "value": {
                        "directgov": 2598573,
                        "govuk": 826,
                        "businesslink": 210194
                    },
                    "end_at": "2012-05-18"
                },
                {
                    "start_at": "2012-05-18",
                    "value": {
                        "directgov": 3397429,
                        "govuk": 980,
                        "businesslink": 329858
                    },
                    "end_at": "2012-05-25"
                },
                {
                    "start_at": "2012-05-25",
                    "value": {
                        "directgov": 3681284,
                        "govuk": 620,
                        "businesslink": 322748
                    },
                    "end_at": "2012-06-01"
                },
                {
                    "start_at": "2012-06-01",
                    "value": {
                        "directgov": 3248936,
                        "govuk": 712,
                        "businesslink": 346098
                    },
                    "end_at": "2012-06-08"
                },
                {
                    "start_at": "2012-06-08",
                    "value": {
                        "directgov": 2688198,
                        "govuk": 529,
                        "businesslink": 233353
                    },
                    "end_at": "2012-06-15"
                },
                {
                    "start_at": "2012-06-15",
                    "value": {
                        "directgov": 0,
                        "govuk": 4916833,
                        "businesslink": 0
                    },
                    "end_at": "2012-06-22"
                },
                {
                    "start_at": "2012-06-22",
                    "value": {
                        "directgov": 0,
                        "govuk": 4635359,
                        "businesslink": 0
                    },
                    "end_at": "2012-06-29"
                },
                {
                    "start_at": "2012-06-29",
                    "value": {
                        "directgov": 0,
                        "govuk": 4481103,
                        "businesslink": 0
                    },
                    "end_at": "2012-07-06"
                },
                {
                    "start_at": "2012-07-06",
                    "value": {
                        "directgov": 0,
                        "govuk": 4868698,
                        "businesslink": 0
                    },
                    "end_at": "2012-07-13"
                },
                {
                    "start_at": "2012-07-13",
                    "value": {
                        "directgov": 0,
                        "govuk": 4765359,
                        "businesslink": 0
                    },
                    "end_at": "2012-07-20"
                },
                {
                    "start_at": "2012-07-20",
                    "value": {
                        "directgov": 0,
                        "govuk": 4715644,
                        "businesslink": 0
                    },
                    "end_at": "2012-07-27"
                },
                {
                    "start_at": "2012-07-27",
                    "value": {
                        "directgov": 0,
                        "govuk": 4085697,
                        "businesslink": 0
                    },
                    "end_at": "2012-08-03"
                },
                {
                    "start_at": "2012-08-03",
                    "value": {
                        "directgov": 0,
                        "govuk": 2500000,
                        "businesslink": 0
                    },
                    "end_at": "2012-08-10"
                },
                {
                    "start_at": "2012-08-10",
                    "value": {
                        "directgov": 0,
                        "govuk": 2600000,
                        "businesslink": 0
                    },
                    "end_at": "2012-08-17"
                },
                {
                    "start_at": "2012-08-17",
                    "value": {
                        "directgov": 0,
                        "govuk": 2700000,
                        "businesslink": 0
                    },
                    "end_at": "2012-08-24"
                },
                {
                    "start_at": "2012-08-24",
                    "value": {
                        "directgov": 0,
                        "govuk": 2800000,
                        "businesslink": 0
                    },
                    "end_at": "2012-08-31"
                },
                {
                    "start_at": "2012-08-31",
                    "value": {
                        "directgov": 0,
                        "govuk": 2900000,
                        "businesslink": 0
                    },
                    "end_at": "2012-09-07"
                }
            ]
        }
    };

    var stubAjaxResponder = function (success) {
        success(jsonResponse);
    };

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

    it("should hide image, show graph titles and generate an svg graph from json data", function () {
        GOVUK.Insights.uniqueVisitors();

        expect(jQuery.ajax).toHaveBeenCalled();

        var svg = $('#unique-visitors-module').find('svg');
        var img = $('#unique-visitors-module').find('img');

        expect(svg.length).not.toBe(0);
        expect($('#hidden-stuff').hasClass('datainsight-hidden')).toBeFalsy();
        expect(img.length).toBe(0);
    });

    it("should remove the png instead if svgs are not supported", function () {
        spyOn(GOVUK, "isSvgSupported").andReturn(false);

        GOVUK.Insights.uniqueVisitors();

        expect(jQuery.ajax).toHaveBeenCalled();

        var png = $('#unique-visitors-module').find('img');
        expect(png.length).not.toBe(0);
    });

    it("should display an error message if there is no data to be shown", function () {
        jsonResponse = null;

        // assuming the jasmine spec browser will support svgs but just to be safe...
        spyOn(GOVUK, "isSvgSupported").andReturn(true);

        GOVUK.Insights.uniqueVisitors();

        expect(jQuery.ajax).toHaveBeenCalled();

        var actualErrorMsg = $('#unique-visitors').find('#error-msg').text();
        var expectedErrorMsg = $(GOVUK.Insights.Helpers.error_div).text();

        expect(actualErrorMsg).toBe(expectedErrorMsg);

    });

});
