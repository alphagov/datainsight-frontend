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
        
        it("renders table header", function() {
            var thead = table.renderHead();
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
            
            var tbody = table.renderBody();
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
        
        var d, columns;
        beforeEach(function() {
            d = {
                title: 'test title',
                foo: 'bar'
            };
            columns = [
                {
                    id: 'foo'
                },
                {
                    id: 'title',
                    className: 'titleclass'
                }
            ];
        });
        
        it("renders a table row", function() {
            var tr = renderRow(d, { columns: columns });
            
            expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
            var cells = tr.find('td');
            expect(cells.length).toEqual(2);
            expect(cells.eq(0).html()).toEqual('bar');
            expect(cells.eq(1).html()).toEqual('test title');
            expect(cells.eq(1).hasClass('titleclass')).toBe(true);
        });
        
        it("renders a table row with custom cell tags", function() {
            var tr = renderRow(d, {
                cellElement: 'th',
                columns: columns
            });
            
            expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
            var cells = tr.find('th');
            expect(cells.length).toEqual(2);
            expect(cells.eq(0).html()).toEqual('bar');
            expect(cells.eq(1).html()).toEqual('test title');
            expect(cells.eq(1).hasClass('titleclass')).toBe(true);
        });
        
        it("renders a table row with dynamic cell content", function() {
            columns[0].getValue = function (d, column) {
                return d.title + ' and ' + d[column.id];
            };
            var tr = renderRow(d, {
                cellElement: 'th',
                columns: columns
            });
            
            expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
            var cells = tr.find('th');
            expect(cells.length).toEqual(2);
            expect(cells.eq(0).html()).toEqual('test title and bar');
            expect(cells.eq(1).html()).toEqual('test title');
            expect(cells.eq(1).hasClass('titleclass')).toBe(true);
        });
        
        it("renders a table row ignoring dynamic cell content when it is disallowed", function() {
            columns[0].getValue = function (d, column) {
                return d.title + ' and ' + d[column.id];
            };
            var tr = renderRow(d, {
                cellElement: 'th',
                columns: columns,
                allowGetValue: false
            });
            
            expect(tr.prop('tagName').toLowerCase()).toEqual('tr');
            var cells = tr.find('th');
            expect(cells.length).toEqual(2);
            expect(cells.eq(0).html()).toEqual('bar');
            expect(cells.eq(1).html()).toEqual('test title');
            expect(cells.eq(1).hasClass('titleclass')).toBe(true);
        });
    });
    
});