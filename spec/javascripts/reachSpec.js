describe("reach", function() {
    beforeEach(function() {
        this.raw_data = [
            {"hour_of_day": 0, "visitors":{"yesterday":666, "today" : 232, "monthly_average": 321}},
            {"hour_of_day": 1, "visitors":{"yesterday":667, "today" : null, "monthly_average": 322}},
            {"hour_of_day": 2, "visitors":{"yesterday":667, "today" : 233, "monthly_average": 322}},
            {"hour_of_day": 3, "visitors":{"yesterday":667, "monthly_average": 322}}
        ];
    });

    describe("axes labels", function() {
        describe("tick values for y axes", function() {
            it("should produce correct tick values", function() {
                expect(get_tick_values(6000, 3)).toEqual([0, 3000, 6000]);
            });

            it("should produce correct tick values", function() {
                expect(get_tick_values(80000, 6)).toEqual([ 0, 16000, 32000, 48000, 64000, 80000 ]);
            });
        });
    });

    describe("data to plot", function() {

        it("should keep null values in the list", function () {
            var raw_response = [
                    {"hour_of_day":0, "visitors":{"yesterday":666, "today":123}},
                    {"hour_of_day":2, "visitors":{"yesterday":null}}
                ],
                data = today_yesterday_to_plot(raw_response);
            expect(data).toEqual([123, null]);
        });

        it("should create a list of values from the raw response", function() {
            var raw_response = [
                    {"hour_of_day":0,"visitors":{"yesterday":666, "today": 123}},
                    {"hour_of_day":1,"visitors":{"yesterday":777}}
                ],
                data = today_yesterday_to_plot(raw_response);
            expect(data).toEqual([123, 777]);
        });

        it("should keep null values for missing today", function() {
            var raw_response = [
                    {"hour_of_day":0,"visitors":{"yesterday":666, "today" : null}},
                    {"hour_of_day":1,"visitors":{"yesterday":777, "today": 123}}
                ],
                data = today_yesterday_to_plot(raw_response);
            expect(data).toEqual([null, 123]);
        });
        it("should keep null values for missing today", function() {
            var raw_response = [
                    {"hour_of_day":0,"visitors":{"yesterday":666, "today" : 232}},
                    {"hour_of_day":1,"visitors":{"yesterday":666, "today": null}},
                    {"hour_of_day":2,"visitors":{"yesterday":777, "today": 123}}
                ],
                data = today_yesterday_to_plot(raw_response);
            expect(data).toEqual([232, null, 123]);
        });
        it("should keep null values for missing yesterday", function() {
            var raw_response = [
                    {"hour_of_day":0,"visitors":{"yesterday":666, "today" : null}},
                    {"hour_of_day":1,"visitors":{"yesterday":null}}
                ],
                data = today_yesterday_to_plot(raw_response);
            expect(data).toEqual([null, null]);
        });
    });

    describe("get fields from raw_data", function() {
        it("should retrieve the monthly average", function() {
            expect(get_monthly_average(this.raw_data, 1)).toEqual(322);
        });

        it("should retrieve today's value", function() {
            expect(get_today(this.raw_data, 2)).toEqual(233);
        });

        it("should retrieve yesterday's value", function() {
            expect(get_yesterday(this.raw_data, 1)).toEqual(667);
        });

        it("should return the number of values we have for today", function() {
           expect(get_todays_hour(this.raw_data)).toEqual(3)
        });

    });

    describe("monthly average to plot", function() {
        it("should retrieve an array of values", function() {
            expect(monthly_average_to_plot(this.raw_data)).toEqual(
                [321, 322, 322 ,322]
            );
        });
    });

    describe("Y-Axis formatting", function(){
        it("should return the same number as string if tick step is below one thousand", function(){
            expect(format_tick_label(100, 800)).toEqual("100");
        });

        it("should return the same number as string if tick step is 1000/6", function(){
            expect(format_tick_label(400, 1000/6)).toEqual("400");
        });

        it("should return value in thousands if tick step is between one thousand and one million", function(){
            expect(format_tick_label(10000, 80000)).toEqual("10k");
        });

        it("should return value in millions if tick step is above one million", function(){
            expect(format_tick_label(1000000, 8000000)).toEqual("1m");
        });
    });
});