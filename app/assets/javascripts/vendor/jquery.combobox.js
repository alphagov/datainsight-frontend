/*!
 * Combobox Plugin for jQuery, version 0.5.0
 *
 * Copyright 2012, Dell Sala
 * http://dellsala.com/
 * https://github.com/dellsala/Combo-Box-jQuery-Plugin
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Date: 2012-01-15
 */
(function () {

    jQuery.fn.combobox = function (selectOptions, options) {
        
        return this.each(function () {
            var newCombobox = new Combobox(this, selectOptions, options);
            jQuery.combobox.instances.push(newCombobox);
        });
    
    };

    jQuery.combobox = {
        instances : []
    };


    var Combobox = function (textInputElement, selectOptions, options) {
        options = options || {};
        
        this.textInputElement = jQuery(textInputElement);
        this.textInputElement.wrap(
            '<span class="combobox" style="position:relative; '+
            'display:-moz-inline-box; display:inline-block;"/>'
        );
        this.selector = new ComboboxSelector(this, options);
        this.setSelectOptions(selectOptions);
        
        if (!options.noShowSelectorButton) {
            this.addShowSelectorButton();
        }
        
        
        this.bindKeypress();
    };

    Combobox.prototype = {
        
        addShowSelectorButton: function () {
            var inputHeight = this.textInputElement.outerHeight();
            var showSelectorButton = jQuery(
                '<a href="#" class="combobox_button" '+
                'style="position:absolute; height:'+inputHeight+'px; width:'+
                inputHeight+'px; top:0;right:0"><div class="combobox_arrow"></div></a>'
            );
            this.textInputElement.css('margin', '0 '+showSelectorButton.outerWidth()+'px 0 0');
            showSelectorButton.insertAfter(this.textInputElement);
            var thisSelector = this.selector;
            var thisCombobox = this;
            showSelectorButton.click(function (e) {
                if (thisSelector.selectorElement.is(':visible')) {
                    // dropdown already shown, close it
                    jQuery('html').trigger('click');
                } else {
                    // dropdown not visible, show it
                    thisSelector.buildSelectOptionList();
                    thisSelector.show();
                    thisCombobox.focus();
                }
                return false;
            });
        },

        setSelectOptions : function (selectOptions) {
            this.selector.setSelectOptions(selectOptions);
            this.selector.buildSelectOptionList(this.getValue());
        },

        bindKeypress : function () {
            var thisCombobox = this;
            this.textInputElement.keyup(function (event) {
                var keyCode = event.keyCode;
                var keys = Combobox.keys;
                
                if (keyCode == keys.ESCAPE) {
                    thisCombobox.setValue('');
                    thisCombobox.textInputElement.trigger('blur');
                    
                    return;
                }
                
                if ($.inArray(keyCode, [keys.TAB, keys.SHIFT, keys.ENTER]) != -1) {
                    return;
                }
                
                if ($.inArray(keyCode, [keys.DOWNARROW, keys.UPARROW]) == -1) {
                    thisCombobox.selector.buildSelectOptionList(thisCombobox.getValue());
                }
                
                thisCombobox.selector.show()
            });
        },
        
        setValue : function (value) {
            var oldValue = this.textInputElement.val();
            this.textInputElement.val(value);
            if (oldValue != value) {
                this.textInputElement.trigger('change');
            }
        },

        getValue : function () {
            return this.textInputElement.val();
        },
        
        focus : function () {
            this.textInputElement.trigger('focus');
        },
        
        blur : function () {
            this.textInputElement.trigger('blur');
        }
        
    };

    Combobox.keys = {
        UPARROW : 38,
        DOWNARROW : 40,
        ENTER : 13,
        ESCAPE : 27,
        TAB : 9,
        SHIFT : 16
    };



    var ComboboxSelector = function (combobox, options) {
        options = options || {};
        
        if (options.summaryEntry) {
            this.summaryEntry = true;
        }
        
        this.combobox = combobox;
        this.optionCount = 0;
        this.selectedIndex = -1;
        this.allSelectOptions = [];
        var selectorTop = combobox.textInputElement.outerHeight();
        var selectorWidth = combobox.textInputElement.outerWidth();
        this.selectorElement = jQuery(
            '<div class="combobox_selector" '+
            'style="display:none; width:'+selectorWidth+
            'px; position:absolute; left: 0; top: '+selectorTop+'px;"'+
            '></div>'
        ).insertAfter(this.combobox.textInputElement);
        var thisSelector = this;
        this.keypressHandler = function (e) {
            if (e.keyCode == Combobox.keys.DOWNARROW) {
                thisSelector.selectNext();
                e.preventDefault();
            } else if (e.keyCode == Combobox.keys.UPARROW) {
                thisSelector.selectPrevious();
                e.preventDefault();
            } else if (e.keyCode == Combobox.keys.ESCAPE) {
                thisSelector.hide();
                thisSelector.combobox.focus();
            } else if (e.keyCode == Combobox.keys.ENTER) {
                if(thisSelector.selectedIndex !== -1){
                    e.preventDefault();
                }
                var selectedValue = thisSelector.getSelectedValue();
                if (selectedValue) {
                    thisSelector.combobox.setValue(selectedValue);
                    thisSelector.combobox.focus();
                } else {
                    thisSelector.combobox.blur();
                }
                thisSelector.hide();
            } else if(e.keyCode == Combobox.keys.TAB){
                thisSelector.hide();
            }
        }
        
    };


    ComboboxSelector.prototype = {

        setSelectOptions : function (selectOptions) {
            this.allSelectOptions = selectOptions;
        },

        buildSelectOptionList : function (term) {
            term = term || '';
            
            this.unselect();
            this.selectorElement.empty();
            var selectOptions = [];
            this.selectedIndex = -1;
            var i;
            for (i=0; i < this.allSelectOptions.length; i++) {
                if (!term.length 
                    || this.allSelectOptions[i].toLowerCase().indexOf(term.toLowerCase()) != -1)
                {
                    selectOptions.push(this.allSelectOptions[i]);
                }
            }
            this.optionCount = selectOptions.length;
            var ulElement = jQuery('<ul></ul>').appendTo(this.selectorElement);
            
            if (this.summaryEntry) {
                var summaryLi = $('<li></li>').addClass('summary');
                summaryLi.html('Show ' + this.optionCount + ' results');
                ulElement.append(summaryLi);
                this.select(0);
            }
            
            
            for (i = 0; i < selectOptions.length; i++) {
                ulElement.append('<li>'+selectOptions[i]+'</li>');
            }
            var thisSelector = this;
            var lis = this.selectorElement.find('li');
            lis.click(function (e) {
                thisSelector.hide();
                if (!$(this).hasClass('summary')) {
                    thisSelector.combobox.setValue(this.innerHTML);
                    thisSelector.combobox.focus();
                }
            });
            lis.mouseover(function (e) {
                var index = lis.index($(this));
                thisSelector.select(index);
            });
            this.htmlClickHandler = function () {
                thisSelector.hide();
            };

        },

        show : function () {
            if (this.selectorElement.find('li').length < 1
                || this.selectorElement.is(':visible'))
            {
                return false;
            }
            jQuery('html').keydown(this.keypressHandler);
            this.selectorElement.slideDown('fast');
            jQuery('html').click(this.htmlClickHandler);
            return true;
        },

        hide : function () {
            jQuery('html').unbind('keydown', this.keypressHandler);
            jQuery('html').unbind('click', this.htmlClickHandler);
            this.selectorElement.unbind('click');
            this.unselect();
            this.selectorElement.hide();
        },

        selectNext : function () {
            var maxIndex = this.optionCount;
            if (!this.summaryEntry) {
                maxIndex--;
            }
            
            var newSelectedIndex = Math.min(this.selectedIndex + 1, maxIndex);
            
            this.select(newSelectedIndex, true);
        },

        selectPrevious : function () {
            var newSelectedIndex = this.selectedIndex - 1;
            if (newSelectedIndex < 0) {
                newSelectedIndex = 0;
            }
            this.select(newSelectedIndex, true);
        },
        
        select : function (index, scrollToElement) {
            this.unselect();
            var selected = this.selectorElement.find('li:eq('+index+')');
            selected.addClass('selected');
            this.selectedIndex = index;
            
            if (scrollToElement) {
                // ensure selected element is visible
                var height = this.selectorElement.innerHeight();
                var scrollTop = this.selectorElement.scrollTop();
                var scrollBottom = scrollTop + this.selectorElement.height();
                var elTop = selected.position().top;
                var elBottom = elTop + selected.outerHeight();
                if (elTop < 0) {
                    this.selectorElement.scrollTop(scrollTop + elTop);
                } else if (elBottom > height) {
                    this.selectorElement.scrollTop(scrollTop + elBottom - height);
                }
            }
        },

        unselect : function () {
            this.selectorElement.find('li').removeClass('selected');
            this.selectedIndex = -1;
        },
        
        getSelectedValue : function () {
            if(this.selectedIndex !== -1){
                var li = this.selectorElement.find('li').eq(this.selectedIndex);
                if (!li.hasClass('summary')) {
                    return li.html();
                } else {
                    return null;
                }
            }
            return this.combobox.textInputElement.val();
        }

    };


})();