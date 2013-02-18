describe("Table", function() {
    
    var Table = GOVUK.Insights.Table;
    
    describe("constructor", function() {
        
        
    });
    
    describe("render", function() {
        it("requires a columns definition", function() {
            expect(function () {
                var table = new Table();
                table.render();
            }).toThrow();
        });
        
        it("renders a table head and table body", function() {
            var table = new Table();
            
            spyOn(table, "renderHead").andReturn($('<thead></thead>'));
            spyOn(table, "renderBody").andReturn($('<tbody></tbody>'));
            
            table.columns = {};
            var el = table.render();
            
            expect(table.renderHead).toHaveBeenCalled();
            expect(table.renderBody).toHaveBeenCalled();
            
            expect(table.el).toBe(el);
            expect(el.prop('tagName').toLowerCase()).toEqual('table');
            expect(el.find('thead').length).toEqual(1);
            expect(el.find('tbody').length).toEqual(1);
        });
    });
    
    describe("renderHead", function() {
        
        var table;
        beforeEach(function() {
            table = new Table();
            table.columns = [
                {
                    id: 'foo',
                    title: 'Foo Title',
                },
                {
                    id: 'bar',
                    title: 'Bar Title',
                    className: 'barclass'
                }
            ];
        });
        
        it("renders table header", function() {
            var thead = table.renderHead($('<thead></thead>'));
            expect(thead.prop('tagName').toLowerCase()).toEqual('thead');
            var tr = thead.find('tr');
            expect(tr.length).toEqual(1);
            var ths = tr.find('th');
            expect(ths.length).toEqual(2);
            expect(ths.eq(0).html()).toEqual('Foo Title');
            expect(ths.eq(1).html()).toEqual('Bar Title');
            expect(ths.eq(1).hasClass('barclass')).toBe(true);
        });
    });
    
    describe("renderBody", function() {
        
        var createData = function (numEntries) {
            var data = [];
            for (var i = 0; i < numEntries; i++) {
                data.push({
                    foo: 'foo' + i,
                    bar: 'bar' + i
                });
            };
            return data;
        };
        
        var table;
        beforeEach(function() {
            var TestTable = function () {};
            TestTable.prototype = new Table();
            TestTable.prototype.columns = [
                {
                    id: 'foo',
                    title: 'Foo Title',
                },
                {
                    id: 'bar',
                    title: 'Bar Title',
                    className: 'barclass'
                }
            ];
            
            table = new TestTable();
        });
        
        it("renders table body", function() {
            table.data = createData(100);
            
            var el = $('<table></table>');
            var tbody = $('<tbody></tbody>').appendTo(el);
            table.renderBody(tbody);
            
            expect(tbody.prop('tagName').toLowerCase()).toEqual('tbody');
            
            var tr = tbody.find('tr');
            expect(tr.length).toEqual(100);
            
            var tds0 = tr.eq(0).find('td');
            expect(tds0.length).toEqual(2);
            expect(tds0.eq(0).html()).toEqual('foo0');
            expect(tds0.eq(1).html()).toEqual('bar0');
            expect(tds0.eq(1).hasClass('barclass')).toBe(true);
            
            var tds99 = tr.eq(99).find('td');
            expect(tds99.length).toEqual(2);
            expect(tds99.eq(0).html()).toEqual('foo99');
            expect(tds99.eq(1).html()).toEqual('bar99');
            expect(tds99.eq(1).hasClass('barclass')).toBe(true);
        });
        
        it("renders full table body for small number of rows when lazy render is active", function() {
            
        });
        
        it("renders partial table body for large number of rows when lazy render is active and initialises lazy rendering", function() {
            
        });
    });
    
    describe("renderRow", function() {
        
        var renderRow = Table.prototype.renderRow;
        
        var d, table;
        beforeEach(function() {
            d = {
                bar: 'bar title',
                foo: 'foo title'
            };
            table = new Table();
            table.columns = [
                {
                    id: 'foo'
                },
                {
                    id: 'bar',
                    className: 'barclass'
                }
            ];
        });
        
        it("renders a table row", function() {
            var tr = table.renderRow(d);
            
            expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
            var cells = tr.find('td');
            expect(cells.length).toEqual(2);
            expect(cells.eq(0).html()).toEqual('foo title');
            expect(cells.eq(1).html()).toEqual('bar title');
            expect(cells.eq(1).hasClass('barclass')).toBe(true);
        });
        
        it("renders a table header row", function() {
            var tr = table.renderRow(d, {
                header: true
            });
            
            expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
            var cells = tr.find('th');
            expect(cells.length).toEqual(2);
            expect(cells.eq(0).html()).toEqual('foo title');
            expect(cells.eq(1).html()).toEqual('bar title');
            expect(cells.eq(1).hasClass('barclass')).toBe(true);
        });
        
        it("renders a table header row for sortable columns", function() {
            table.columns[0].sortable = true;
            table.columns[1].sortable = true;
            var tr = table.renderRow(d, {
                header: true
            });
            
            expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
            var cells = tr.find('th');
            expect(cells.length).toEqual(2);
            expect(cells.eq(0).text()).toEqual('foo title');
            expect(cells.eq(1).text()).toEqual('bar title');
            expect(cells.eq(0).find('span.arrow').length).toEqual(1);
            expect(cells.eq(1).find('span.arrow').length).toEqual(1);
            expect(cells.eq(1).hasClass('barclass')).toBe(true);
            expect(cells.eq(0).hasClass('sortable')).toBe(true);
            expect(cells.eq(1).hasClass('sortable')).toBe(true);
            
            
            
        });
        
        it("renders a table header row for sortable columns and indicates current sort column ascending", function() {
            table.columns[0].sortable = true;
            table.columns[1].sortable = true;
            table.sortColumn = 'bar';
            
            var tr = table.renderRow(d, {
                header: true
            });
            
            expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
            var cells = tr.find('th');
            expect(cells.length).toEqual(2);
            expect(cells.eq(0).text()).toEqual('foo title');
            expect(cells.eq(1).text()).toEqual('bar title');
            expect(cells.eq(0).find('span.arrow').length).toEqual(1);
            expect(cells.eq(1).find('span.arrow').length).toEqual(1);
            expect(cells.eq(1).hasClass('barclass')).toBe(true);
            expect(cells.eq(0).hasClass('sortable')).toBe(true);
            expect(cells.eq(1).hasClass('sortable')).toBe(true);
            expect(cells.eq(1).hasClass('ascending')).toBe(true);
            expect(cells.eq(1).hasClass('descending')).toBe(false);
        });
        
        it("renders a table header row for sortable columns and indicates current sort column descending", function() {
            table.columns[0].sortable = true;
            table.columns[1].sortable = true;
            table.sortColumn = 'bar';
            table.sortDescending = true;
            
            var tr = table.renderRow(d, {
                header: true
            });
            
            expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
            var cells = tr.find('th');
            expect(cells.length).toEqual(2);
            expect(cells.eq(0).text()).toEqual('foo title');
            expect(cells.eq(1).text()).toEqual('bar title');
            expect(cells.eq(0).find('span.arrow').length).toEqual(1);
            expect(cells.eq(1).find('span.arrow').length).toEqual(1);
            expect(cells.eq(1).hasClass('barclass')).toBe(true);
            expect(cells.eq(0).hasClass('sortable')).toBe(true);
            expect(cells.eq(1).hasClass('sortable')).toBe(true);
            expect(cells.eq(1).hasClass('ascending')).toBe(false);
            expect(cells.eq(1).hasClass('descending')).toBe(true);
        });
        
        it("renders a table row with dynamic cell content", function() {
            table.columns[0].getValue = function (d, column) {
                return d.bar + ' and ' + d[column.id];
            };
            var tr = table.renderRow(d, {
                header: true
            });
            
            expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
            var cells = tr.find('th');
            expect(cells.length).toEqual(2);
            expect(cells.eq(0).html()).toEqual('bar title and foo title');
            expect(cells.eq(1).html()).toEqual('bar title');
            expect(cells.eq(1).hasClass('barclass')).toBe(true);
        });
        
        it("renders a table row ignoring dynamic cell content when it is disallowed", function() {
            table.columns[0].getValue = function (d, column) {
                return d.bar + ' and ' + d[column.id];
            };
            var tr = table.renderRow(d, {
                header: true,
                allowGetValue: false
            });
            
            expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
            var cells = tr.find('th');
            expect(cells.length).toEqual(2);
            expect(cells.eq(0).html()).toEqual('foo title');
            expect(cells.eq(1).html()).toEqual('bar title');
            expect(cells.eq(1).hasClass('barclass')).toBe(true);
        });
    });
    
    describe("sortByColumn", function() {
        
        var table;
        beforeEach(function() {
            var TestTable = function () {};
            TestTable.prototype = new Table();
            TestTable.prototype.columns = [
                {
                    id: 'foo',
                    title: 'Foo Title',
                },
                {
                    id: 'bar',
                    title: 'Bar Title'
                }
            ];
            
            table = new TestTable();
            table.data = [
                {
                    foo: 'fooa',
                    bar: 'barc',
                    count: 0
                },
                {
                    foo: 'foob',
                    bar: 'barb',
                    count: 2
                },
                {
                    foo: 'fooc',
                    bar: 'bara',
                    count: 1
                }
            ];
        });
        
        it("sorts string data by a column ascending", function() {
            table.sortByColumn('foo');
            expect(table.data[0].bar).toEqual('barc');
            expect(table.data[0].foo).toEqual('fooa');
            expect(table.data[0].count).toEqual(0);
            expect(table.data[2].bar).toEqual('bara');
            expect(table.data[2].foo).toEqual('fooc');
            expect(table.data[2].count).toEqual(1);
            
            table.sortByColumn('bar');
            expect(table.data[0].bar).toEqual('bara');
            expect(table.data[0].foo).toEqual('fooc');
            expect(table.data[0].count).toEqual(1);
            expect(table.data[2].bar).toEqual('barc');
            expect(table.data[2].foo).toEqual('fooa');
            expect(table.data[2].count).toEqual(0);
        });
        
        it("sorts string data by a column descending", function() {
            table.sortByColumn('foo', true);
            expect(table.data[0].bar).toEqual('bara');
            expect(table.data[0].foo).toEqual('fooc');
            expect(table.data[0].count).toEqual(1);
            expect(table.data[2].bar).toEqual('barc');
            expect(table.data[2].foo).toEqual('fooa');
            expect(table.data[2].count).toEqual(0);
        });
        
        it("sorts numeric data by a column ascending", function() {
            table.sortByColumn('count');
            expect(table.data[0].count).toEqual(0);
            expect(table.data[0].bar).toEqual('barc');
            expect(table.data[0].foo).toEqual('fooa');
            expect(table.data[2].count).toEqual(2);
            expect(table.data[2].bar).toEqual('barb');
            expect(table.data[2].foo).toEqual('foob');
        });
        
        it("sorts numeric data by a column descending", function() {
            table.sortByColumn('count', true);
            expect(table.data[0].count).toEqual(2);
            expect(table.data[0].bar).toEqual('barb');
            expect(table.data[0].foo).toEqual('foob');
            expect(table.data[2].count).toEqual(0);
            expect(table.data[2].bar).toEqual('barc');
            expect(table.data[2].foo).toEqual('fooa');
        });
        
    });
    
    describe("applyPreventDocumentScroll", function () {
        
        var table, tbody, handler, evt;
        beforeEach(function() {
            table = new Table();
            tbody = {
                outerHeight: jasmine.createSpy(),
                scrollTop: jasmine.createSpy(),
                prop: jasmine.createSpy(),
                on: jasmine.createSpy()
            };
            table.el = {
                find: jasmine.createSpy().andReturn(tbody)
            };
            table.applyPreventDocumentScroll();
            handler = tbody.on.argsForCall[0][1];
            evt = {
                preventDefault: jasmine.createSpy()
            };
        });
        
        it("retrieves the tbody child element", function() {
            table.applyPreventDocumentScroll();
            expect(table.el.find).toHaveBeenCalledWith('tbody');
            expect(tbody.on).toHaveBeenCalled();
            expect(tbody.on.argsForCall[0][0]).toEqual('mousewheel');
            expect(typeof tbody.on.argsForCall[0][1]).toEqual('function');
        });
        
        it("prevents mousewheel default event when scrolling upwards at the top", function() {
            tbody.scrollTop.andReturn(0);
            tbody.outerHeight.andReturn(400);
            tbody.prop.andReturn(600);
            handler(evt, null, null, 1);
            expect(evt.preventDefault).toHaveBeenCalled();
        });
        
        it("prevents mousewheel default event when scrolling downwards at the bottom", function() {
            tbody.scrollTop.andReturn(200);
            tbody.outerHeight.andReturn(400);
            tbody.prop.andReturn(600);
            handler(evt, null, null, -1);
            expect(evt.preventDefault).toHaveBeenCalled();
        });
        
        it("does not prevent mousewheel default event when scrolling downwards at the top", function() {
            tbody.scrollTop.andReturn(0);
            tbody.outerHeight.andReturn(400);
            tbody.prop.andReturn(600);
            handler(evt, null, null, -1);
            expect(evt.preventDefault).not.toHaveBeenCalled();
        });
        
        it("does not prevent mousewheel default event when scrolling upwards at the bottom", function() {
            tbody.scrollTop.andReturn(200);
            tbody.outerHeight.andReturn(400);
            tbody.prop.andReturn(600);
            handler(evt, null, null, 1);
            expect(evt.preventDefault).not.toHaveBeenCalled();
        });
        
        it("does not prevent mousewheel default event when scrolling in the middle", function() {
            tbody.scrollTop.andReturn(100);
            tbody.outerHeight.andReturn(400);
            tbody.prop.andReturn(600);
            handler(evt, null, null, -1);
            expect(evt.preventDefault).not.toHaveBeenCalled();
            handler(evt, null, null, 1);
            expect(evt.preventDefault).not.toHaveBeenCalled();
        });
        
        it("does not prevent mousewheel default event when scrollbars are not active", function() {
            tbody.scrollTop.andReturn(0);
            tbody.outerHeight.andReturn(400);
            tbody.prop.andReturn(400);
            handler(evt, null, null, 1);
            expect(evt.preventDefault).not.toHaveBeenCalled();
        });
        
    });
    
});