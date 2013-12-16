describe("visits graph generation", function () {

    var stubGraphDiv = $('<div id="visits-module"><img src="https://www.google.com/images/srpr/logo3w.png" /><div class="datainsight-hidden" id="hidden-stuff"><div id="visits"></div>I am all invisible and stuff</div></div>');

    var jsonResponse = {
        "response_info": {
            "status": "ok"
        },
        "id": "https://www.gov.uk/performance/dashboard/visits.json",
        "web_url": "",
        "details": {
            "source": [
                "Google Analytics",
                "Celebrus",
                "Omniture"
            ],
            "data": [
                {
                    "start_at": "2013-08-11",
                    "end_at": "2013-08-17",
                    "value": {
                        "govuk": 7983145
                    }
                },
                {
                    "start_at": "2013-08-18",
                    "end_at": "2013-08-24",
                    "value": {
                        "govuk": 9181483
                    }
                },
                {
                    "start_at": "2013-08-25",
                    "end_at": "2013-08-31",
                    "value": {
                        "govuk": 8958736
                    }
                },
                {
                    "start_at": "2013-09-01",
                    "end_at": "2013-09-07",
                    "value": {
                        "govuk": 9560140
                    }
                },
                {
                    "start_at": "2013-09-08",
                    "end_at": "2013-09-14",
                    "value": {
                        "govuk": 9446054
                    }
                },
                {
                    "start_at": "2013-09-15",
                    "end_at": "2013-09-21",
                    "value": {
                        "govuk": 9359556
                    }
                },
                {
                    "start_at": "2013-09-22",
                    "end_at": "2013-09-28",
                    "value": {
                        "govuk": 9599421
                    }
                },
                {
                    "start_at": "2013-09-29",
                    "end_at": "2013-10-05",
                    "value": {
                        "govuk": 10106349
                    }
                },
                {
                    "start_at": "2013-10-06",
                    "end_at": "2013-10-12",
                    "value": {
                        "govuk": 10071395
                    }
                },
                {
                    "start_at": "2013-10-13",
                    "end_at": "2013-10-19",
                    "value": {
                        "govuk": 9346004
                    }
                },
                {
                    "start_at": "2013-10-20",
                    "end_at": "2013-10-26",
                    "value": {
                        "govuk": 9555975
                    }
                },
                {
                    "start_at": "2013-10-27",
                    "end_at": "2013-11-02",
                    "value": {
                        "govuk": 9089700
                    }
                },
                {
                    "start_at": "2013-11-03",
                    "end_at": "2013-11-09",
                    "value": {
                        "govuk": 9045273
                    }
                },
                {
                    "start_at": "2013-11-10",
                    "end_at": "2013-11-16",
                    "value": {
                        "govuk": 8824550
                    }
                },
                {
                    "start_at": "2013-11-17",
                    "end_at": "2013-11-23",
                    "value": {
                        "govuk": 8826457
                    }
                },
                {
                    "start_at": "2013-11-24",
                    "end_at": "2013-11-30",
                    "value": {
                        "govuk": 9030830
                    }
                },
                {
                    "start_at": "2013-12-01",
                    "end_at": "2013-12-07",
                    "value": {
                        "govuk": 8677740
                    }
                },
                {
                    "start_at": "2013-12-08",
                    "end_at": "2013-12-14",
                    "value": {
                        "govuk": 8081531
                    }
                }
            ]
        },
        "updated_at": "2013-12-15T05:00:05"
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
