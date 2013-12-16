describe("unique visitors graph generation", function () {

    var stubGraphDiv = $('<div id="unique-visitors-module"><img src="https://www.google.com/images/srpr/logo3w.png" /><div class="datainsight-hidden" id="hidden-stuff"><div id="unique-visitors"></div>I am all invisible and stuff</div></div>');

    var jsonResponse = {
        "response_info": {
            "status": "ok"
        },
        "id": "https://www.gov.uk/performance/dashboard/unique-visitors.json",
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
                        "govuk": 5409838
                    }
                },
                {
                    "start_at": "2013-08-18",
                    "end_at": "2013-08-24",
                    "value": {
                        "govuk": 6211934
                    }
                },
                {
                    "start_at": "2013-08-25",
                    "end_at": "2013-08-31",
                    "value": {
                        "govuk": 6249812
                    }
                },
                {
                    "start_at": "2013-09-01",
                    "end_at": "2013-09-07",
                    "value": {
                        "govuk": 6519975
                    }
                },
                {
                    "start_at": "2013-09-08",
                    "end_at": "2013-09-14",
                    "value": {
                        "govuk": 6492773
                    }
                },
                {
                    "start_at": "2013-09-15",
                    "end_at": "2013-09-21",
                    "value": {
                        "govuk": 6483786
                    }
                },
                {
                    "start_at": "2013-09-22",
                    "end_at": "2013-09-28",
                    "value": {
                        "govuk": 6726810
                    }
                },
                {
                    "start_at": "2013-09-29",
                    "end_at": "2013-10-05",
                    "value": {
                        "govuk": 7097870
                    }
                },
                {
                    "start_at": "2013-10-06",
                    "end_at": "2013-10-12",
                    "value": {
                        "govuk": 6987605
                    }
                },
                {
                    "start_at": "2013-10-13",
                    "end_at": "2013-10-19",
                    "value": {
                        "govuk": 6570773
                    }
                },
                {
                    "start_at": "2013-10-20",
                    "end_at": "2013-10-26",
                    "value": {
                        "govuk": 6757611
                    }
                },
                {
                    "start_at": "2013-10-27",
                    "end_at": "2013-11-02",
                    "value": {
                        "govuk": 6472140
                    }
                },
                {
                    "start_at": "2013-11-03",
                    "end_at": "2013-11-09",
                    "value": {
                        "govuk": 6381171
                    }
                },
                {
                    "start_at": "2013-11-10",
                    "end_at": "2013-11-16",
                    "value": {
                        "govuk": 6264386
                    }
                },
                {
                    "start_at": "2013-11-17",
                    "end_at": "2013-11-23",
                    "value": {
                        "govuk": 6259047
                    }
                },
                {
                    "start_at": "2013-11-24",
                    "end_at": "2013-11-30",
                    "value": {
                        "govuk": 6460426
                    }
                },
                {
                    "start_at": "2013-12-01",
                    "end_at": "2013-12-07",
                    "value": {
                        "govuk": 6156092
                    }
                },
                {
                    "start_at": "2013-12-08",
                    "end_at": "2013-12-14",
                    "value": {
                        "govuk": 5756204
                    }
                }
            ]
        },
        "updated_at": "2013-12-15T05:00:05"
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
