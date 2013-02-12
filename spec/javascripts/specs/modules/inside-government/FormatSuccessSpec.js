describe("inside gov format success graph", function () {

    var stubGraphContainer = $("<div id='inside-gov-format-success'></div>");

    var STUB_DATA = {
        "response_info":{
            "status":"ok"
        },
        "id":"http://datainsight-frontend.dev.gov.uk/performance/dashboard/government/format-success.json",
        "details":{
            "source":["Totally made up"],
            "data":[
                {
                    "format":"small grey",
                    "entries":5000,
                    "percentage_of_success":50
                }
            ]
        },
        "updated_at":"2012-10-30T09:27:34+00:00"
    };

    
    // outdated, replace with new inside-gov specific test
    xit("should insert an svg onto the page", function () {
        stubGraphContainer.appendTo('body');

        GOVUK.Insights.InsideGovernment.formatSuccess(STUB_DATA);

        expect($("#inside-gov-format-success").length).toBeGreaterThan(0);
        
        stubGraphContainer.remove();
    });

});