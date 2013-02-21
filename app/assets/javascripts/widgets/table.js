var GOVUK = GOVUK || {};
GOVUK.Insights= GOVUK.Insights || {};

GOVUK.Insights.Table = function (options) {
    // constructor
    options = this.options = $.extend({}, {
        lazyRender: false,
        preventDocumentScroll: true
    }, options);
};

/**
 * Renders the table using the column definition and the current data.
 */
GOVUK.Insights.Table.prototype.render = function () {
    
    if (!this.columns) {
        throw('no columns defined for table');
    }
    
    var el = this.el;
    if (!el) {
        el = this.el = $('<table></table>');
    }
    el.empty();
    
    var thead = $('<thead></thead>');
    thead.appendTo(el);
    this.renderHead(thead);
    
    var tbody = $('<tbody></tbody>');
    tbody.appendTo(el);
    this.renderBody(tbody);
    
    if (this.options.preventDocumentScroll) {
        this.applyPreventDocumentScroll();
    }
    
    return this.el;
};

/**
 * Renders a thead element with a table row containing th elements.
 * Cell values are retrieved from `title` property of columns definition.
 */
GOVUK.Insights.Table.prototype.renderHead = function (thead) {
    
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
 */
GOVUK.Insights.Table.prototype.renderBody = function (tbody) {
    
    var data = this.data;
    var that = this;
    
    if (this.options.lazyRender) {
        // render table on demand in chunks. whenever the user scrolls to the
        // bottom, append another chunk of rows.
        
        var rowsPerChunk = 30;
        var index = 0;
        
        var placeholderRow = $('<tr class="placeholder"><td colspan="' + this.columns.length + '">&hellip;</td></tr>');
        // FIXME: placeholder height needs to be measured, rather than hardcoded
        var placeholderHeight = 43;
        
        var renderChunk = function () {
            placeholderRow.remove();
            var last = Math.min(index + rowsPerChunk, data.length);
            for (; index < last; index++) {
                var tr = that.renderRow.call(that, data[index]);
                tr.appendTo(tbody);
            };
            if (last < data.length) {
                // more rows available, show placeholder
                tbody.append(placeholderRow);
            }
        }

        tbody.on('scroll', function (e) {
            var visibleHeight = tbody.outerHeight();
            var scrollHeight = tbody.prop('scrollHeight');
            var scrolling = (scrollHeight > visibleHeight);
            
            if (tbody.scrollTop() + visibleHeight >= scrollHeight - placeholderHeight) {
                // scrolled down to last row, show more
                renderChunk();
            }
        });
        
        // render first chunk
        renderChunk();
        
    } else {
        // render whole table in one go
        $.each(data, function (i, d) {
            var tr = that.renderRow.call(that, d);
            tr.appendTo(tbody);
        });
    }
    
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
            td.addClass('sortable');
            
            var currentSortColumn = (column === that.sortColumn);
            
            if (currentSortColumn) {
                td.addClass(that.sortDescending ? 'descending' : 'ascending');
            }
            var handler = function (e) {
                var descending;
                if (currentSortColumn) {
                    descending = !that.sortDescending;
                } else {
                    descending = column.defaultDescending;
                }
                that.sortByColumn.call(that, column, descending);
                that.render.call(that);
            };
            if (window.Modernizr && Modernizr.touch) {
                td.on('touchend', handler);
            } else {
                td.on('click', handler);
            }
        }
        
    });
    
    return tr;
};

GOVUK.Insights.Table.prototype.defaultComparator = function (a, b, column, descending) {
    var aVal = a[column.id];
    if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
    }
    var bVal = b[column.id];
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

GOVUK.Insights.Table.prototype.sortByColumn = function (column, descending) {
    
    var comparator;
    if (typeof column.comparator === 'function') {
        comparator = column.comparator;
    } else {
        comparator = this.defaultComparator;
    }
    
    var that = this;
    this.data.sort(function (a, b) {
        return comparator.call(that, a, b, column, descending);
    });
    this.sortColumn = column;
    this.sortDescending = descending;
};

GOVUK.Insights.Table.prototype.resort = function () {
    this.sortByColumn(this.sortColumn, this.sortDescending);
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
