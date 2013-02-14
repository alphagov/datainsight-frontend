var GOVUK = GOVUK || {};
GOVUK.Insights= GOVUK.Insights || {};

GOVUK.Insights.Table = function (options) {
    // constructor
    options = this.options = $.extend({}, options, {
        lazyRender: false
    });
};

/**
 * Renders the table using the column definition and the current data.
 */
GOVUK.Insights.Table.prototype.render = function () {
    
    if (!this.columns) {
        throw('no columns defined for table');
    }
    
    var el = this.el = $('<table></table>');
    
    var thead = this.renderHead();
    thead.appendTo(el);
    
    var tbody = this.renderBody();
    tbody.appendTo(el);
    
    return el;
};

/**
 * Renders a thead element with a table row containing th elements.
 * Cell values are retrieved from `title` property of columns definition.
 */
GOVUK.Insights.Table.prototype.renderHead = function () {
    var thead = $('<thead></thead>');
    
    var titles = {};
    $.each(this.columns, function (i, column) {
        titles[column.id] = column.title;
    });
    
    var tr = this.renderRow(titles, {
        cellElement: 'th',
        allowGetValue: false
    });
    tr.appendTo(thead);
    
    return thead;
};

/**
 * Renders a tbody element with rows for the current data.
 * @param {Array} [data=this.data] Data to render
 */
GOVUK.Insights.Table.prototype.renderBody = function (data) {
    data = data || this.data;
    
    var tbody = $('<tbody></tbody>');
    
    var that = this;
    $.each(data, function (i, d) {
        var tr = that.renderRow.call(that, d);
        tr.appendTo(tbody);
    });
    
    return tbody;
};

/**
 * Renders a row of table cells.
 * @param {Object} d Data for this row.
 * @param {Object} [options={}] Render options
 * @param {Array} [options.columns=this.columns] Column definition, defaults to instance columns. See GOVUK.Insights.prototype.columns for syntax.
 * @param {String} [options.cellElement=td] Tag name for cell elements
 */
GOVUK.Insights.Table.prototype.renderRow = function (d, options) {
    options = $.extend({}, {
        columns: this.columns,
        cellElement: 'td',
        valueKey: 'id',
        allowGetValue: true
    }, options);
    
    var tr = $('<tr></tr>');
    var tdString = '<' + options.cellElement + '/>';
    
    $.each(options.columns, function (i, column) {
        var td = $(tdString);
        td.addClass(column.className);
        
        var value;
        if (options.allowGetValue && typeof column.getValue === 'function') {
            value = column.getValue(d, column); 
        } else {
            value = d[column.id];
        }
        td.html(value);
        
        td.appendTo(tr);
    });
    
    return tr;
};


GOVUK.Insights.Table.prototype.foo = function () {
    
};

