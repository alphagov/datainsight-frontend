var GOVUK = GOVUK || {};
GOVUK.Insights= GOVUK.Insights || {};

GOVUK.Insights.Table = function (options) {
    // constructor
    options = this.options = $.extend({}, options, {
        lazyRender: false,
        preventDocumentScroll: true
    });
};

/**
 * Renders the table using the column definition and the current data.
 */
GOVUK.Insights.Table.prototype.render = function () {
    
    if (!this.columns) {
        throw('no columns defined for table');
    }
    
    if (!this.el) {
        this.el = $('<table></table>');
    }
    this.el.empty();
    
    var thead = this.renderHead();
    thead.appendTo(this.el);
    
    var tbody = this.renderBody();
    tbody.appendTo(this.el);
    
    if (this.options.preventDocumentScroll) {
        this.applyPreventDocumentScroll();
    }
    
    return this.el;
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
        header: true,
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
 * @param {Boolean} [options.header=false] Render table header cells instead of body cells
 */
GOVUK.Insights.Table.prototype.renderRow = function (d, options) {
    options = $.extend({}, {
        columns: this.columns,
        header: false,
        valueKey: 'id',
        allowGetValue: true
    }, options);
    
    var tr = $('<tr></tr>');
    
    var tdString = options.header ? '<th></th>' : '<td></td>';
    
    var that = this;
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
        
        if (options.header && column.sortable) {
            td.append('<span class="arrow"></span>');
            td.addClass('sortable');
            var currentSortColumn = (column.id === that.sortColumn);
            
            if (currentSortColumn) {
                td.addClass(that.sortDescending ? 'descending' : 'ascending');
            }
            td.on('click', function (e) {
                var descending = (currentSortColumn && !that.sortDescending);
                that.sortByColumn.call(that, column.id, descending);
                that.render.call(that);
            });
        }
        
    });
    
    return tr;
};


GOVUK.Insights.Table.prototype.sortByColumn = function (columnId, descending) {
    
    var comparator = function (a, b) {
        var aVal = a[columnId];
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
        }
        var bVal = b[columnId];
        if (typeof bVal === 'string') {
            bVal = bVal.toLowerCase();
        }
        var res = 0;
        if (aVal < bVal) {
            res = -1;
        } else if (aVal > bVal) {
            res = 1;
        }
        if (descending) {
            res *= -1;
        }
        
        return res;
    };
    
    this.data.sort(comparator);
    this.sortColumn = columnId;
    this.sortDescending = descending;
};

/**
 * Stops the page from scrolling when the user scrolls inside the table
 */
GOVUK.Insights.Table.prototype.applyPreventDocumentScroll = function () {
    var el = this.el.find('tbody');
    
    el.on('mousewheel', function (e, delta, deltaX, deltaY) {
        
        var visibleHeight = el.outerHeight();
        var scrollHeight = el.prop('scrollHeight');
        
        if (scrollHeight <= visibleHeight) {
            // nothing to do if there are no scrollbars
            return;
        }
        
        // prevent document scroll if scrolling upwards at the top
        var scrollTop = el.scrollTop();
        if (scrollTop == 0 && deltaY > 0) {
            e.preventDefault();
            return;
        }
        
        // prevent document scroll if scrolling downwards at the bottom
        if (scrollTop + visibleHeight >= scrollHeight && deltaY < 0) {
            e.preventDefault();
            return;
        }
    });
};
