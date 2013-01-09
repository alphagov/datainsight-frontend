describe("time series", function () {
    var timeseries, data, stubGraphElement;

    beforeEach(function () {
        timeseries = GOVUK.Insights.timeSeriesGraph();

        data = [
            {x:new Date(2012, 10, 1), y:10},
            {x:new Date(2012, 10, 8), y:20},
            {x:new Date(2012, 10, 15), y:30},
            {x:new Date(2012, 10, 22), y:5},
            {x:new Date(2012, 10, 29), y:40},
            {x:new Date(2012, 11, 6), y:15},
            {x:new Date(2012, 11, 13), y:25}
        ];

        stubGraphElement = $('<div id="graph"></div>');

        stubGraphElement.clone().appendTo("body");
    });

    afterEach(function () {
        $("#graph").remove();
    });

    function render() {
        d3.select("#graph").datum(data).call(timeseries);
    }

    function graphSelection() {
        return d3.select("#graph svg");
    }

    describe("svg dimensions", function () {
        it("should set the height", function () {
            timeseries.height(300);
            render();
            expect(graphSelection().attr("height")).toEqual("300");
        });

        it("should set the width", function () {
            timeseries.width(300);
            render();
            expect(graphSelection().attr("width")).toEqual("300");
        });
    });

    describe("series rendering", function () {
        it("should render a line", function () {
            render();
            expect(graphSelection().selectAll("path.line").empty()).toBeFalsy();
        });

        it("should render a shaded area", function () {
            render();
            expect(graphSelection().selectAll("path.shade").empty()).toBeFalsy();
        })
    });

    describe("annotations rendering", function () {
        it("should render annotation markers", function () {
            var annotations = [
                {
                    date:"2012-11-20",
                    text:"Beginning of history",
                    link:"http://en.wikipedia.org/wiki/Big_bang"
                },
                {
                    date:"2012-12-10",
                    text:"GOV.UK website launched, including Inside Government holding page",
                    link:"http://digital.cabinetoffice.gov.uk/2012/10/17/why-gov-uk-matters/"
                }
            ];

            timeseries.annotations(annotations)
            render();
            expect(graphSelection().selectAll("g.annotation")[0].length).toEqual(2);
        });
    });

});