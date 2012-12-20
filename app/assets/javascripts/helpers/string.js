var GOVUK = GOVUK || {};
GOVUK.Insights = GOVUK.Insights || {};

GOVUK.Insights.extensions = function () {
    if (String.prototype.idify === undefined) {
        String.prototype.idify = function () {
            var result = this.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]+/g,'');
            if (result.length === 0) throw new Error('Resulting ID of ['+ this + '] would be empty');
            return result;
        };
    } else {
        throw new Error('Trying to overwrite existing prototypal function');
    }
}();
