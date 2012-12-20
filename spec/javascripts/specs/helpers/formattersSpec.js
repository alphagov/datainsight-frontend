describe("Data insight formatting helpers", function () {
    describe("Short date formats", function () {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
            createTest = function (i) {
                it("should format month " + monthNames[i] + " correctly", function () {
                    var date = new Date(2012, i, 1);
                    expect(GOVUK.Insights.shortDateFormat(date))
                        .toBe("1 " + monthNames[i]);
                });
            };
        for (var i = 0; i < 12; i++) {
            createTest(i);
        }
    });

    describe("numericLabelFormatterFor", function () {
        describe("max value of 1000", function () {
            beforeEach(function () {
                this.formatter = GOVUK.Insights.numericLabelFormatterFor(1000);
            });
            it("should return 0 for 0", function () {
                expect(this.formatter(0)).toBe("0");
            });
            it("should return 0.4k for 400", function () {
                expect(this.formatter(400)).toBe("0.4k");
            });
            it("should return 1.5k for 1500", function () {
                expect(this.formatter(1500)).toBe("1.5k");
            });
        });

        describe("max value of 1000000", function () {
            beforeEach(function () {
                this.formatter = GOVUK.Insights.numericLabelFormatterFor(1000000);
            });
            it("should return 0 for 0", function () {
                expect(this.formatter(0)).toBe("0");
            });
            it("should return 0.1m for 5000", function () {
                expect(this.formatter(5000)).toBe("0.1m");
            });
            it("should return 1.5m for 150000", function () {
                expect(this.formatter(1500000)).toBe("1.5m");
            });
        });
    });
    describe("formatNumericLabel", function() {
        it("should display entire numbers from 0 to 499", function() {
            expect(GOVUK.Insights.formatNumericLabel(0)).toBe('0');
            expect(GOVUK.Insights.formatNumericLabel(1)).toBe('1');
            expect(GOVUK.Insights.formatNumericLabel(9)).toBe('9');
            expect(GOVUK.Insights.formatNumericLabel(10)).toBe('10');
            expect(GOVUK.Insights.formatNumericLabel(77)).toBe('77');
            expect(GOVUK.Insights.formatNumericLabel(100)).toBe('100');
            expect(GOVUK.Insights.formatNumericLabel(398)).toBe('398');
            expect(GOVUK.Insights.formatNumericLabel(499)).toBe('499');
        });

        it("should display numbers from 500 to 499499 as fractions of 1k", function() {
            expect(GOVUK.Insights.formatNumericLabel(500)).toBe('0.50k');
            expect(GOVUK.Insights.formatNumericLabel(777)).toBe('0.78k');
            expect(GOVUK.Insights.formatNumericLabel(994)).toBe('0.99k');
            expect(GOVUK.Insights.formatNumericLabel(995)).toBe('1.00k');
            expect(GOVUK.Insights.formatNumericLabel(996)).toBe('1.00k');
            expect(GOVUK.Insights.formatNumericLabel(999)).toBe('1.00k');
            expect(GOVUK.Insights.formatNumericLabel(1000)).toBe('1.00k');
            expect(GOVUK.Insights.formatNumericLabel(1005)).toBe('1.01k');
            expect(GOVUK.Insights.formatNumericLabel(1006)).toBe('1.01k');
            expect(GOVUK.Insights.formatNumericLabel(100000)).toBe('100k');
            expect(GOVUK.Insights.formatNumericLabel(234568)).toBe('235k');
            expect(GOVUK.Insights.formatNumericLabel(499499)).toBe('499k');
        });

        it("should display numbers from 499500 and above as fractions of 1m", function() {
            expect(GOVUK.Insights.formatNumericLabel(499500)).toBe('0.50m');
            expect(GOVUK.Insights.formatNumericLabel(500000)).toBe('0.50m');
            expect(GOVUK.Insights.formatNumericLabel(777777)).toBe('0.78m');
            expect(GOVUK.Insights.formatNumericLabel(994499)).toBe('0.99m');
            expect(GOVUK.Insights.formatNumericLabel(994999)).toBe('0.99m');
            expect(GOVUK.Insights.formatNumericLabel(995000)).toBe('1.00m');
            expect(GOVUK.Insights.formatNumericLabel(995001)).toBe('1.00m');
            expect(GOVUK.Insights.formatNumericLabel(999900)).toBe('1.00m');
            expect(GOVUK.Insights.formatNumericLabel(1000000)).toBe('1.00m');
            expect(GOVUK.Insights.formatNumericLabel(1005000)).toBe('1.01m');
            expect(GOVUK.Insights.formatNumericLabel(1005001)).toBe('1.01m');
            expect(GOVUK.Insights.formatNumericLabel(100000000)).toBe('100m');
            expect(GOVUK.Insights.formatNumericLabel(234568234)).toBe('235m');
            expect(GOVUK.Insights.formatNumericLabel(499499499)).toBe('499m');
        });

        describe("generative tests", function() {
            var createTests = function(start, end, increment, format) {
                    it("should correctly format numbers in the range " + start + "-" + end, function() {
                        for (var i = start; i < end; i+=increment) {
                            createExpectation(i, format(i));
                        }
                    })
                },
                createExpectation = function(i, expectation) {
                    expect(GOVUK.Insights.formatNumericLabel(i)).toBe(expectation);
                };


            createTests(0,   20,   1, function(i) { return i.toString(); });
            createTests(500, 600,  1, function(i) { return "0." + Math.round(i / 10) + "k"; });
            createTests(980, 995,  1, function(i) { return "0." + Math.round(i / 10) + "k"; });
            createTests(995, 1000, 1, function(i) {
                var expected = "1." + (Math.round(i / 10) - 100);
                if (expected.length < 4) {
                    expected += "0";
                }
                return expected + "k";
            });
            createTests(1000,   1100,    1,    function(i) { return (Math.round(i / 10) / 100).toPrecision(3) + "k"; });
            createTests(9400,   10000,   10,   function(i) { return (Math.round(i / 10) / 100).toPrecision(3) + "k"; });
            createTests(10000,  11500,   10,   function(i) { return (Math.round(i / 100) / 10).toPrecision(3) + "k"; });
            createTests(50450,  50500,   10,   function(i) { return (Math.round(i / 100) / 10).toPrecision(3) + "k"; });
            createTests(100000, 101000,  10,   function(i) { return Math.round(i / 1000).toPrecision(3) + "k"; });
            createTests(499000, 499500,  100,  function(i) { return Math.round(i / 1000).toPrecision(3) + "k"; });
            createTests(499500, 500000,  100,  function(i) { return (Math.round(i / 10000) / 100).toPrecision(2) + "m"; });
            createTests(504500, 506000,  150,  function(i) { return (Math.round(i / 10000) / 100).toPrecision(2) + "m"; });
            createTests(700000, 800000,  150,  function(i) { return (Math.round(i / 10000) / 100).toPrecision(2) + "m"; });
            createTests(994499, 995000,  150,  function(i) { return (Math.round(i / 10000) / 100).toPrecision(2) + "m"; });
            createTests(995000, 999999,  150,  function(i) { return (Math.round(i / 10000) / 100).toPrecision(3) + "m"; });
            createTests(999999, 1999999, 10000, function(i) { return (Math.round(i / 10000) / 100).toPrecision(3) + "m"; });
        });

        describe("rounding changes", function () {
            it("should now show millions to two decimal places", function () {
                expect(GOVUK.Insights.formatNumericLabel(1220000)).toBe("1.22m");
            });

            it("should show all millions to two decimal places", function () {
                expect(GOVUK.Insights.formatNumericLabel(1000000)).toBe("1.00m");
                expect(GOVUK.Insights.formatNumericLabel(1010000)).toBe("1.01m");
                expect(GOVUK.Insights.formatNumericLabel(9099000)).toBe("9.10m");
                expect(GOVUK.Insights.formatNumericLabel(1009900)).toBe("1.01m");
            })
        });
    });

    describe("hex color functions", function () {

        it("should convert from hex to RGB", function () {
            var colour1 = new GOVUK.Insights.colors('#ff00ff');
            var colour2 = new GOVUK.Insights.colors('#030201');

            expect(colour1.red).toBe(255);
            expect(colour1.green).toBe(0);
            expect(colour1.blue).toBe(255);

            expect(colour2.red).toBe(3);
            expect(colour2.green).toBe(2);
            expect(colour2.blue).toBe(1);

        });

        it("should darken a colour by a set amount", function () {
            var colour = new GOVUK.Insights.colors('#050607');
            colour.multiplyWithSelf();

            expect(colour.red).toBe(5 * 5 / 255);
            expect(colour.blue).toBe(7 * 7 / 255);
            expect(colour.green).toBe(6 * 6 / 255);
        });

        it("should convert to css notation", function () {
            var colour1 = new GOVUK.Insights.colors('#050505');
            var colour2 = new GOVUK.Insights.colors('#050505');

            colour1.green = 255;

            colour2.red = 0;
            colour2.green = 0;
            colour2.blue = 0;

            expect(colour1.asCSS()).toBe('#05ff05');
            expect(colour2.asCSS()).toBe('#000000');
        });

        it("should initialize from jQuerys weird rgb notation", function () {
            var colour1 = new GOVUK.Insights.colors('rgb(14, 15, 16)');

            expect(colour1.red).toBe(14);
            expect(colour1.green).toBe(15);
            expect(colour1.blue).toBe(16);
        });

        it("should return nicely chaining functions", function () {
            var colour = new GOVUK.Insights.colors('#151515');

            expect(colour.multiplyWithSelf().asCSS()).toBe('#010101');
        });

    });

    describe("hour conversion", function () {
        var convert = GOVUK.Insights.convertTo12HourTime;

        it("should convert 24 hour time to 12 hour time", function () {
            expect(convert(13)).toBe("1pm");
            expect(convert(00)).toBe("12am");
            expect(convert(10)).toBe("10am");
            expect(convert(24)).toBe("12am");
        });
    });

});