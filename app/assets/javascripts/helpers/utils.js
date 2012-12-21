var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.utils = {
	createGettersAndSetters: function (config, instance) {
		Object.keys(config).forEach(function (key) {
			instance[key] = function (value) {
				switch (arguments.length) {
					case 0: return config[key];
					case 1: config[key] = value;
				}
				return instance;
			};
		});
	}
};