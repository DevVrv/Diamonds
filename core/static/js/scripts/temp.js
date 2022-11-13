"use strict";

// @ ------------------------------- GET MAX MIN


// // @ -------------------------------- FILTER SORT
class Sort {
    constructor(kwargs) {
        
        // <-- get simple
        this.simple = this.getElement(kwargs.simple);
        this.simpleElems = this.getElements(kwargs.simpleElems, this.simple);
        this.simpleElemsShow = this.getElements(kwargs.simpleElemsShow, this.simple);

        // <-- get simple values
        this.simpleValues = this.simpleElems.map((elem) => { return elem.dataset.ioSimpleSort; });
        this.simpleShowValues = this.simpleElemsShow.map((elem) => { return elem.dataset.ioSimpleSort; });
        
        // <-- get advanced
        this.advanced = this.getElement(kwargs.advanced);
        this.dragList = this.getElement(kwargs.dragList, this.advanced);
        this.typeList = this.getElement(kwargs.typeList, this.advanced);

        // <-- get advanced elems
        this.dragElems = this.getElements(kwargs.advancedElems, this.dragList);
        this.typeElems = this.getElements(kwargs.advancedElems, this.typeList);
        
        // * all advanced elems
        this.advancedElems = [...this.dragElems, ...this.typeElems];
        this.elemsSelector = kwargs.advancedElems;

        // <-- get action buttons
        this.angles = this.getChilds(this.advancedElems, kwargs.angle);
        this.plus = this.getChilds(this.advancedElems, kwargs.plus);
        this.handle = kwargs.handle;

        // * data arr
        this.sortableValues = ['sale_price'];

        this.key = kwargs.key;

        // * data control
        this.control = kwargs.control || null;
        // * view control
        this.view = kwargs.view || null;
        // * ajax function
        this.ajax = kwargs.ajax || null;
        
    }

    init() {

        // --> plus event manager
        this.plusEvent();
        this.angleEvent();
        this.sortableCreate();
        this.updateSimple();
        this.simpleSelect();
        
        return this;
    }

    // @ Debug
    debug(info = this) {
        console.log(info);
        return this;
    }

    // @ Get element
    getElement(selector, parent = document) {
        const element = parent.querySelector(selector);
        return element;
    }

    // @ Get elements
    getElements(selector, parent = document) {
        const elements = [...parent.querySelectorAll(selector)];
        return elements;
    }

    // @ Get childs elements
    getChilds(arr, selector) {
        const childs = [];
        arr.map((elem) => {childs.push(elem.querySelector(selector))});
        return childs;
    }

    // --> Plus event manager
    plusEvent() {
        this.plus.map(toggler => {
            toggler.onclick = () => {

                // <-- get parent element
                const elem = toggler.closest(this.elemsSelector);
                const sortValue = elem.dataset.ioAdvancedSort;
                const sortValueReverse = `-${sortValue}`;
                
                // * jump element to type
                if (elem.parentElement == this.dragList) {
                    
                    // update elements
                    this.typeList.insertAdjacentElement('afterbegin', elem);
                    this.dragElems = this.dragElems.filter((dragElem) => { return dragElem != elem; })
                    this.typeElems.unshift(elem);
                    elem.classList.remove('active-1');
                    elem.classList.remove('active-2');

                    // remove value from sortable
                    this.sortableValues = this.sortableValues.filter((value) => { return value != sortValue && value != sortValueReverse });
                    
                }
                // * jump element to drag
                else if (elem.parentElement == this.typeList) {
                    
                    // update elements
                    this.dragList.insertAdjacentElement('afterbegin', elem);
                    this.typeElems = this.typeElems.filter((typeElem) => { return typeElem != elem; })
                    this.dragElems.unshift(elem);
                    elem.classList.add('active-2');

                    // push value in sortable
                    this.sortableValues.unshift(sortValue);

                }

                // * update values ordering
                this.dragEvent();
                // * update simple ordering
                this.updateSimple();
                // * update data control
                this.updateData();
            };
        });
    }

    // --> Angle event manager
    angleEvent() {
        this.angles.map((angle) => {
            angle.onclick = () => {

                // get parent & parent values
                const parent = angle.closest(this.elemsSelector);
                const parentValue = parent.dataset.ioAdvancedSort;
                const parentValueReverse = `-${parentValue}`;

                // if value is not reverse
                if (parent.classList.contains('active-1')) {

                    // update elem class list
                    parent.classList.remove('active-1');
                    parent.classList.add('active-2');

                    // update sortable values
                    this.sortableValues = this.sortableValues.map((value) => {
                        if (value == parentValueReverse) { value = parentValue; }
                        return value;
                    });
                            
                }
                // if value is reverse
                else if (parent.classList.contains('active-2')) {
                    
                    // update elem class list
                    parent.classList.add('active-1');
                    parent.classList.remove('active-2');

                    // update sortable values
                    this.sortableValues = this.sortableValues.map((value) => {
                        if (value == parentValue) { value = parentValueReverse; }
                        return value;
                    });

                }
                // * update simple ordering
                this.updateSimple();
                // * update data control
                this.updateData();
            }
        });
    }

    // --> Update sortable values
    dragEvent() {
        this.dragElems.map(element => {
            
            element.ondragend = () => {
                // clean values arr
                this.sortableValues = [];
                // new ordering drag elems list
                this.dragElems = this.getElements(this.elemsSelector, this.dragList);

                this.dragElems.map((elem) => {

                    // * get elem values
                    const sortValue = elem.dataset.ioAdvancedSort;
                    const sortValueReverse = `-${sortValue}`;

                    // --> update sortable values
                    if (elem.classList.contains('active-1')) {
                        this.sortableValues.push(sortValueReverse);
                    }
                    else if (elem.classList.contains('active-2')) {
                        this.sortableValues.push(sortValue);
                    }

                });

                // * update simple ordering
                this.updateSimple();
                // * update data control
                this.updateData();

            };
        });
    }

    // --> Simple select event manager
    simpleSelect() {
        this.simpleElems.map(elem => {
            elem.addEventListener('click', () => {

                // * crate sort name value
                const sortName = elem.dataset.ioSimpleSort;
                const sortNameReverse = `-${sortName}`;
                let order;
                
                // @ remove active from simples
                this.simpleElems.map((cleanElem) => {
                    if (cleanElem != elem) {
                        cleanElem.classList.remove('active-1');
                        cleanElem.classList.remove('active-2');
                    }
                });

                // --> add new active to simple + update sort values list
                if (elem.classList.contains('active-1') || !elem.classList.contains('active-1') && !elem.classList.contains('active-2')) {
                    // * update class list in simple elems
                    elem.classList.remove('active-1');
                    elem.classList.add('active-2');
                    order = 'active-2';
                    
                    
                    // * update sort values list
                    this.sortableValues = this.sortableValues.filter(value => { return value != sortName && value != sortNameReverse });
                    
                    this.sortableValues.unshift(sortName);
                }
                else if (elem.classList.contains('active-2')) {
                    // * update class list in simple elems
                    elem.classList.remove('active-2');
                    elem.classList.add('active-1');
                    order = 'active-1';

                    // * update sort values list
                    this.sortableValues = this.sortableValues.filter(value => { return value != sortName && value != sortNameReverse });
                    
                    this.sortableValues.unshift(sortNameReverse);
                }

                // * update advanced
                this.updateAdvanced(sortName, order);
                // * update data control
                this.updateData();
            });
        });
    }

    // * Update advanced on simple is chosen
    updateAdvanced(value, order) {
        this.simpleShowValues.map(simpleValue => {
            if (value == simpleValue) {
                // * get selected advanced element
                let advancedSelected;
                this.advancedElems.map(elem => {
                    
                    if (value == elem.dataset.ioAdvancedSort) {
                        advancedSelected = elem;
                        advancedSelected.classList.remove('active-1');
                        advancedSelected.classList.remove('active-2');
                        advancedSelected.classList.add(order);
                    }
                });

                // * update advanced list
                this.dragList.insertAdjacentElement('afterbegin', advancedSelected);

                
            }
        });
    }

    // * Update simple on advanced is chosen
    updateSimple() {

        // * get top element
        const advancedTop = this.getElement('[data-io-advanced-sort]', this.dragList);

        // * if exist
        if (advancedTop !== null && advancedTop !== undefined) {
            // * get top value
            const advencedTopValue = advancedTop.dataset.ioAdvancedSort;

            // * get diraction
            let direction;
            if (advancedTop.classList.contains('active-1')) {
                direction = 'active-1';
            }
            else if (advancedTop.classList.contains('active-2')) {
                direction = 'active-2';
            }
            
            // * get eq or undefined
            const equality = this.simpleValues.filter(simpleValue => { return simpleValue == advencedTopValue })[0];
            
            // * simple elems class list change
            this.simpleElems.map(elem => {
                // clear active
                elem.classList.remove('active-1');
                elem.classList.remove('active-2');
            });

            if (equality !== undefined) {
                this.simpleElems.map(elem => {
                    // get elem attr
                    const attr = elem.dataset.ioSimpleSort;

                    // add active to elem
                    if (attr == equality) { elem.classList.add(direction); }
                });
            }
        }
        else {
            this.simpleElems.map(elem => {
                // clear active
                elem.classList.remove('active-1');
                elem.classList.remove('active-2');
            });
        }
    }

    // * Drag manager create
    sortableCreate() {
        this.dragObject = new Sortable(this.dragList, {
            animation: 150,
            handle: this.handle
        });
    }

    // * Updata data control
    updateData() {

        // * values exceptions
        const unset = ['compare', '-compare'];
        
        // * first value
        const firstSort = this.sortableValues[0];

        // * catch compare
        if (firstSort === unset[0] || firstSort === unset[1]) {

            let compareValues = JSON.parse(localStorage.getItem('comparison'));
            compareValues = compareValues.map(value => { return value.slice(4) });
            
            this.control.data.compare[this.key] = firstSort;

        }
        else {
            this.control.data.compare[this.key] = false;
        }

        // * remove compare
        this.sortableValues = this.sortableValues.filter(value => { return value !== unset[0] && value !== unset[1]; });

        // * set sort key
        this.control.sortKey = this.key;
        this.control.data.sortKey = this.key;

        // --> update data and send ajax
        if (this.key == 'result') {
            this.control.sort.sortResult = this.sortableValues;
            this.control.data.sort.sortResult  = this.sortableValues;
        }
        else if (this.key == 'best') {
            this.control.sortBest = this.sortableValues;
            this.control.data.sort.sortBest = this.sortableValues;
        }
        else if (this.key == 'comparison') {
            this.control.sortComparison = this.sortableValues;
                this.control.data.sort.sortComparison = this.sortableValues;

            this.control.data.comparisonKeys = JSON.parse(localStorage.getItem('comparison')).map(value => { return value.replace('chb_', '') });

            if (this.view.comparisonCheckboxes) {
                this.control.data.comparisonSelected = this.view.comparisonCheckboxes.names.map(value => { return value.replace('chb_', '') });
            }

            // --> send ajax
            if (this.ajax !== null) {
                this.ajax.func(this.ajax.url, this.control.data, this.view.setComparison, this.view);
            }

            return this
        }

        // * set ordinal default
        this.control.ordinal[this.key] = [0, 40];
        this.control.data.ordinal[this.key] = [0, 40];

        // --> send ajax
        this.ajax.func(this.ajax.url, this.control.data, this.view.filter, this.view);
    }
}

// // @ -------------------------------- CONTROLLER OF UI DATA
class DataControl {

    constructor(kwargs) {
        // * sliders
        this.sliders = [];

        // * nums data
        this.numsDefault = {};
        this.numsUpdated = {};

        // * str data
        this.strDefault = {};
        this.strUpdated = {};

        // * boolean fields data
        this.shape = [];
        this.lab = [];

        // * ordinal scale
        this.ordinal = {
            result: [0, 40],
            best: [0, 40],
        };

        // * ordinal scale
        this.sort = {
            sortResult: ['sale_price'],
            sortBest: ['sale_price'],
            sortComparison: ['sale_price']
        };

        // * last sort key
        this.key = 'all';

        // * comparison pks
        this.comparisonPks = false;
        
        // * comparison order
        this.compare = {
            result: false,
            best: false,
            comparison: false
        }

        // * parent element
        this.parent = kwargs.parent;

        this.strList = {
            color: ['M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D'],
            clarity: ['I2', 'I1', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FI'],
            cut: ['Fair', 'Good', 'Very Good', 'Ideal', 'Super Ideal'],
            symmetry: ['Good', 'Very Good', 'Excellent'],
            fluor: ['None', 'Faint', 'Medium', 'Strong', 'Very Strong'],
            polish: ['Good', 'Very Good', 'Excellent'],
        }

        // * data object
        this.data = {
            compare: this.compare,
            nums: this.numsUpdated,
            str: this.strUpdated,
            shape: this.shape,
            lab: this.lab,
            sort: this.sort,
            key: this.key,
            ordinal: this.ordinal
        };

        // <-- Get cleaner button
        this.cleanButton = this.parent.querySelector(kwargs.cleanButton);

        // <-- boolean fields items
        this.chb = this.parent.querySelectorAll(kwargs.chb);

        // * infinity scroll
        this.infinity = {};

    }

    // * Create Default Data
    createData(key, value, type) {

        if (type == 'num') {
            // ? remove $ from price
            if (key == 'sale_price' || key == 'price' || key == 'rap_price' || key == 'rap_1ct') {
                value[0] = value[0].slice(0, -1);
                value[1] = value[1].slice(0, -1);
            }
            this.numsDefault[key] = value;
        }
        else if (type == 'str') {
            this.strDefault[key] = value;
        }

    }

    // * Create Updated Data
    updatedData(key, value, type) {
        
        
        // -- remove $ from price
        if (key == 'sale_price' || key == 'price' || key == 'rap_price' || key == 'rap_1ct') {
            value[0] = value[0].slice(0, -1);
            value[1] = value[1].slice(0, -1);
        }

        // update data nums
        if (type == 'num') {
            // ? update dataUpdated object
            this.numsUpdated[key] = value;

            // ? remove key if values is euqals
            if (this.numsUpdated[key][0] == this.numsDefault[key][0] && this.numsUpdated[key][1] == this.numsDefault[key][1]) {
                delete this.numsUpdated[key];
            }
        }
        
        // update data str
        else if (type == 'str') {
            // ? update dataUpdated object
            this.strUpdated[key] = value;

            // ? remove key if values is euqals
            if (this.strUpdated[key].length === this.strDefault[key].length) {
                delete this.strUpdated[key];
            }
        }
    }

    // * show hide clean button
    clean() {

        // * create clean view
        this.showClean = false;

        // ? Equality for nums
        if (Object.keys(this.numsUpdated).length !== 0) {

            for (let key in this.numsUpdated) {

                if (this.numsUpdated[key][0] !== this.numsDefault[key][0] || this.numsUpdated[key][1] !== this.numsDefault[key][1]) {
                    this.showClean = true;
                }

            }

        }
        // ? Equality for str
        if (Object.keys(this.strUpdated).length !== 0) {

            for (let key in this.strUpdated) {
                if (this.strUpdated[key].length < this.strDefault[key].length) {
                    this.showClean = true;
                }
            }
        }
        // ? Equality for lab
        if (Object.keys(this.lab).length != 0) {
            this.showClean = true;
        }
        // ? Equality for shape
        if (Object.keys(this.shape).length != 0) {
            this.showClean = true;
        }
        
        // --> show / hide clean button
        if (this.showClean === true) {
            this.cleanButton.classList.remove('hidden');
            this.cleanButton.removeAttribute('disabled');
        }
        else {
            this.cleanButton.classList.add('hidden');
            this.cleanButton.setAttribute('disabled', true);
        }
    }

    // * data default
    dataDefault() {

        // ordinal
        this.ordinal = {
            result: [0, 40],
            best: [0, 40],
        };

        // values
        this.numsUpdated = {};
        this.strUpdated = {};
        this.shape = [];
        this.lab = {};
        this.sort = {
            sortBest: ['sale_price'],
            sortComparison: ['sale_price'],
            sortResult: ['sale_price'],
        };
        this.key = 'result';


        // data object
        this.data = {
            compare: this.compare,
            nums: this.numsUpdated,
            str: this.strUpdated,
            shape: this.shape,
            lab: this.lab,
            sort: this.sort,
            key: this.key,
            ordinal: this.ordinal
        };

        return this.data;
    }

    // * clean filter
    cleanFilter(func = Function, context = Object) {

        this.cleanButton.addEventListener('click', () => {

            // reset filters
            this.sliders.forEach(slider => {
                slider.reset();
            });

            // hide reset button
            this.cleanButton.classList.add('hidden');
            this.cleanButton.setAttribute('disabled', null);

            // set unchecked in checkbox
            this.chb.forEach(elem => {
                elem.checked = false;
                elem.removeAttribute('selected');
                elem.nextElementSibling.classList.remove('active');
            });

            // set default values
            this.dataDefault();
            
            // set infinity default
            if (this.infinity !== undefined && this.infinity.result !== undefined) {
                this.infinity.result.default();
            }

            // --> Ajax Request
            ajax('filtering/', this.data, func, context);
        });
    }
}

// @ -------------------------------- UI CONTROLLER
class UI {

    constructor(kwargs) {

        // ? data control
        this.control = kwargs.control;

        // ? infinity
        this.infinity = kwargs.infinity;

        // ? keys
        this.key = kwargs.key;

        // ? GET Parent
        this.parent = kwargs.parent || document;
        if (typeof (this.parent) == 'string') {
            this.parent = this.getElement(this.parent, document);
        }

        // ? GET Slider Or Checkbox
        if (kwargs.checkbox == undefined) {
            this.slider = this.getElement(kwargs.selector, this.parent);
        }
        else {
            this.checkbox = this.getElements(kwargs.checkbox, this.parent);
        }

        // ? Options for noUI
        this.options = kwargs.options;

        // ? Optional Number Inputs
        if (kwargs.inputs) {
            this.inputs = {
                min: this.getElement(kwargs.inputs.min),
                max: this.getElement(kwargs.inputs.max)
            };
        }

        // ? Optional Pips
        if (kwargs.pips) {
            this.pips = kwargs.pips;
            this.pipsName = kwargs.pipsName;
        }

        // Debuging
        if (kwargs.debug == true) {
            this.debug();
        }
    }

    // Debug
    debug(context = this) {
        console.log(context);
    }
    // GET Element
    getElement(selector, parent = document) {
        const element = parent.querySelector(selector);
        return element;
    }

    // GET Elements
    getElements(selector, parent = document) {
        const elements = parent.querySelectorAll(selector);
        return elements;
    }

    // ui request
    uiRequest(func = Function, context = Object) {
        // * update data
        this.control.ordinal = {
            result: [0, 40],
            best: [0, 40],
        };
        this.control.key = 'all';
        this.control.data = {
            shape: this.control.shape,
            nums: this.control.numsUpdated,
            lab: this.control.lab,
            str: this.control.strUpdated,
            sort: this.control.sort,
            ordinal: this.control.ordinal,
            compare: this.control.data.compare,
            comparisonKeys: JSON.parse(localStorage.getItem('comparison')).map(value => { return value.replace('chb_', '') })
        }

        // set infinity default
        if (this.infinity !== undefined && this.infinity.result !== undefined) {
            this.infinity.result.default();
        }
        if (document.documentElement.getBoundingClientRect().width > 768) {
            // --> Ajax Request
            ajax('filtering/', this.control.data, func, context);
        }
    }

    // Create number UI
    num(func = Function, context = Object) {

        // @ create UI Slider
        this.noUi = noUiSlider.create(this.slider, this.options);
        this.control.sliders.push(this.noUi);

        // * set default data
        this.control.createData(this.key, this.noUi.get(), 'num');

        // ? onUpdate
        this.noUi.on('update', () => {
            // get value from slider
            let value = this.noUi.get();

            // set value in input
            if (this.inputs) {
                this.inputs.min.value = value[0];
                this.inputs.max.value = value[1];
            }
        });

        // --> input min \ max changer
        this.inputs.min.addEventListener('input', () => {

            if (this.minMaxTimerId != undefined) {
                clearTimeout(this.minMaxTimerId);
            }

            this.minMaxTimerId = setTimeout(() => {

                this.noUi.set([this.inputs.min.value, null]);
                // ? set updated data
                this.control.updatedData(this.key, this.noUi.get(), 'num');
                this.control.clean();
        
                // --> request
                this.uiRequest(func, context);

            }, 300);
        });
        this.inputs.max.addEventListener('input', () => {

            if (this.minMaxTimerId != undefined) {
                clearTimeout(this.minMaxTimerId);
            }

            this.minMaxTimerId = setTimeout(() => {

                this.noUi.set([null, this.inputs.max.value]);
                // ? set updated data
                this.control.updatedData(this.key, this.noUi.get(), 'num');
                this.control.clean();
    
                // --> request
                this.uiRequest(func, context);

            }, 300);
        });

        // ? onChange
        this.noUi.on('change', () => {
            // ? set updated data
            this.control.updatedData(this.key, this.noUi.get(), 'num');
            // ? show hide clean button
            this.control.clean();

            // --> request
            this.uiRequest(func, context);
        });
        return this;
    }

    // Create str UI
    str(func = Function, context = Object) {
        // ? sreate UI Slider
        this.noUi = noUiSlider.create(this.slider, this.options);
        this.control.sliders.push(this.noUi);

        // ? set default data
        this.control.createData(this.key, this.pipsName, 'str');

        // ? set pips name
        if (this.pips) {
            this.pips = this.slider.querySelectorAll(this.pips);
            this.pips.forEach((pip, i) => {
                pip.textContent = this.pipsName[i];
            });
        }

        // ? onChange
        this.noUi.on('change', () => {

            // ? create pips names list
            let [from, to] = this.noUi.get();
            const uiValue = this.control.strList[this.key].slice(from - 1, to + 1);

            // ? updatedData add pips items
            this.control.updatedData(this.key, uiValue, 'str');
            // ? show hide clean button
            this.control.clean();

            // --> request
            this.uiRequest(func, context);

        });
        return this;
    }

    // shapes
    bool(type, func = Function, context = Object) {

        // * iterate checkbox
        this.checkbox.forEach(chb => {
            // --> create bool save in data
            chb.addEventListener('input', () => {

                // * get checkbox name
                const value = chb.getAttribute('name');
                let type = chb.parentElement.dataset.chbType;
                if (type == undefined) {type = chb.parentElement.parentElement.dataset.chbType}
                const shapeValues = ['Round', 'Marquise', 'Asscher', 'Cushion', 'Emerald', 'Heart', 'Oval', 'Pear', 'Princess', 'Radiant'];
                const labValues = ['IGI', 'GIA', 'GCAL', 'HDR'];
                // * update values
                if (type == 'shape') {
                    if (this.control.shape.indexOf(shapeValues[value]) === -1) {
                        this.control.shape.push(shapeValues[value]);
                    }
                    else {
                        this.control.shape = this.control.shape.filter(v => {return v !== shapeValues[value]});
                    }
                    if (document.documentElement.getBoundingClientRect().width <= 768) {
                        // --> Ajax Request
                        ajax('filtering/', this.control.data, func, context);
                    }
                }
                else if (type == 'lab') {
                    if (this.control.lab.indexOf(labValues[value]) === -1) {
                        this.control.lab.push(labValues[value]);
                    } else {
                        this.control.lab = this.control.lab.filter(v => {return v !== labValues[value]});
                    }
                }

                // if (type == 'shape') {
                //     if (this.control.shape.indexOf(value) === -1) {
                //         this.control.shape.push(value);
                //     }
                //     else {
                //         this.control.shape = this.control.shape.filter(v => {return v !== value});
                //     }
                //     if (document.documentElement.getBoundingClientRect().width <= 768) {
                //         // --> Ajax Request
                //         ajax('filtering/', this.control.data, func, context);
                //     }
                // }
                // else if (type == 'lab') {
                //     if (this.control.lab.indexOf(value) === -1) {
                //         this.control.lab.push(value);
                //     } else {
                //         this.control.lab = this.control.lab.filter(v => {return v !== value});
                //     }
                // }
                // --> show hide clean button
                this.control.clean();

                // --> request
                this.uiRequest(func, context);
            });
        });
    }
}

// @ -------------------------------- Diamond View
class DiamondView {

    constructor(kwargs) {

        // * get diamonds parent
        this.parent = this.getElement(kwargs.parent);

        // * get diamonds containers
        this.containerResult = this.getElement(kwargs.result, this.parent);
        this.containerBest = this.getElement(kwargs.best, this.parent);
        this.containerComparison = this.getElement(kwargs.comparison, this.parent);

        // * comparison button clear buttons
        this.comparisonClear = this.getElement(kwargs.comparisonClear, this.parent);
        this.comparisonDelete = this.getElement(kwargs.comparisonDelete, this.parent);

        // * add to cart button
        this.addToCart = this.getElement(kwargs.addToCart);
        this.addToCartLength = this.getElement(kwargs.addToCartLength, this.addToCart);

        // * comparison length button
        this.comparisonLength = this.getElement(kwargs.comparisonLength);

        // * results length button
        this.resultsLength = this.getElement(kwargs.resultsLength);
        this.bestLength = this.getElement(kwargs.bestLength);

        // * cart length
        this.cartLink = this.getElement(kwargs.cart_link);

        // * control
        this.control = kwargs.control;

        // * show result fiilter button
        this.showFilterResultButton = this.getElement(kwargs.showFilterResult)

        // * ordinal scale
        this.ordinal = {
            result: [0, 40],
            best: [0, 40],
        };

        // --> init functions
        this.init();

    }

    // DEBUG
    debug(info = this) {
        console.log(info);
        return this;
    }
    
    // init
    init() {

        // --> accordion init
        this.accordion(this.containerResult);
        this.accordion(this.containerBest);

        // --> label init
        this.labelResul = this.select(this.containerResult);
        this.labelBest = this.select(this.containerBest);

        // --> set selected
        this.selected();
        // --> update comparison list
        this.getComparison(this.setComparison);
        // --> set comparison length
        this.setComparisonLength();
        // --> delet selected comparsion diamonds
        this.comparisonDeleteSelected();
        // --> delet all comparsion diamonds
        this.comparisonDeleteAll();

        // add to cart
        this.sendToCart();

        // filter show result 768-
        this.filterShowButton();
    }

    // GET element
    getElement(selector, parent = document) {
        const elements = parent.querySelector(selector);
        return elements;
    }

    // GET elements
    getElements(selector, parent = document) {
        const elements = [...parent.querySelectorAll(selector)];
        return elements;
    }

    // GET childs
    getChilds(selector, arr) {
        const nodes = arr.map(item => {
            const input = item.querySelector(selector);
            return input;
        });
        return nodes;
    }

    // spin
    spiner(margin = 'my-1') {
        let test = 'visually-hidden'
        const spin =
            `
            <div class="text-center text-primary py-4 shadow-sm w-100 border-bottom border-top bg-lite ${margin}" id="loading-spiner">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            `
        return spin;
    }

    // init accordion
    accordion(parent, notThis = '[data-io-label]') {

        // ? diamond drop down
        const diamondItem = new ElementsControl({
            parent: parent,
            manager: ".result__item-list",
            managed: ".result__drop-down",
        }).toggler({ single: true, notThis: notThis});

        // ? diamond more info
        const diamondMoreInfo = new ElementsControl({
            parent: parent,
            manager: ".btn-more--info",
            managed: ".body-more--info",
        }).toggler({ single: true });
    }

    // Possibility to choose chb
    select(parent, context = this) {

        // * diamond label
        const labels = new ElementsControl({
            parent: parent,
            manager: '[data-io-label="diamonds-item"]',
            managed: '.checkbox-results'
        });

        // --> init select func
        labels.label(
            // checked
            (value) => {
                // update storage
                context.storage(value);
                // update selected view
                context.selected();
                // update comparison html
                context.getComparison(context.setComparison);
                // update comparison length
                context.setComparisonLength();
                // accordion for comparison
                context.accordion(context.containerComparison);
            },
            // unchecked
            (value) => {
                // update storage
                context.storage(value);
                // update selected view
                context.selected();
                // update comparison html
                context.getComparison(context.setComparison);
                // update comparison length
                context.setComparisonLength();
                // accordion for comparison
                context.accordion(context.containerComparison);
            }
        );

        return {
            label: labels.manager,
            chb: labels.managed
        }
    }

    // Set checked view
    selected(key = 'comparison') {

        // * get all chb + label
        const labels = this.getElements('[data-io-label]', this.parent);
        const inputs = this.getChilds('.checkbox-results', labels);

        // * clear inputs + labels active
        labels.map(label => { label.classList.remove('active'); })
        inputs.map(input => { input.checked = false });
        

        // * get storage selected
        const storage = JSON.parse(localStorage.getItem(key));

        // ? if storage exists
        if (storage !== null && storage.length !== 0) {

            const set = storage.map(value => {
                inputs.map(inp => {
                    if (inp.getAttribute('name') == value) {
                        inp.checked = true;
                        inp.parentElement.classList.add('active');
                    }
                });
            });

        }
        else {
            const empty = `
            <div class="text-center text-primary py-4 border shadow-sm w-100 bg-lite">
                <p class="fs-5 m-0">Comparison list is empty</p>
            </div>
            `;
            this.containerComparison.innerHTML = empty;
        }

        return this;
    }

    // Save selected ID
    storage(value, key = 'comparison') {

        // * if storage is empty, create storage arr
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify([value]));
        }

        // * update storage value
        else if (localStorage.getItem(key)) {

            // * get storage data
            let storageData = JSON.parse(localStorage.getItem(key));

            // * get index of value, or -1
            const indexOfValue = storageData.indexOf(value);

            // ?
            if (indexOfValue === -1) {
                storageData.push(value);
            } else {
                storageData = storageData.filter((pk) => { return pk !== value });
            }

            // --> save storage data
            localStorage.setItem(key, JSON.stringify(storageData));

        }

        return this;
    }

    // Set comparison HTML
    setComparison(diamonds, context) {
        
        // get delivery date
        const delivery = deliveryDate('get');

        // * empty block
        const empty = `
            <div class="text-center text-primary py-4 border shadow-sm w-100 bg-lite">
                <p class="fs-5 m-0">Comparison list is empty</p>
            </div>
        `;

        // ? if diamonds exists
        if (diamonds !== null && diamonds !== undefined && diamonds.length !== 0) {

            const shapeList = ['Round', 'Marquise', 'Asscher', 'Cushion', 'Emerald', 'Heart', 'Oval', 'Pear', 'Princess', 'Radiant', 'Another'];

            // clear html in comparison container
            context.containerComparison.innerHTML = '';
            // iterate diamonds

            context.containerComparison.innerHTML = context.spiner();

            setTimeout(() => {
                context.containerComparison.innerHTML = '';
                diamonds.forEach(diamond => {
                    // * shape list

                    // * get delivery date
                    const delivery = deliveryDate('get');

                    // * create path for photo
                    let photo = '/static/img/diamonds/base-diamond.jpg';
                    if (diamond.fields.photo !== 'N/A' && diamond.fields.photo !== '') {
                        photo = diamond.fields.photo;
                    }
                    
                    // * get shape icon key
                    let shape = diamond.fields.shape;
                    let shapeValue = shapeList.filter(value => { return value == shape });
                    if (shapeValue.length == 0) {
                        shapeValue = 'Round'
                    }
                    // * create diamond html
                    const diamondHTML = `
                    <div class="result__item result-section--element" data-io-diamond="comparison"
                    data-io-copy="to-comparison">
                        <ul class="item-list result__item-list">
                            <li class="item-list-element">
                                <i class="item-shape svg-${diamond.fields.shape.toLowerCase()}"></i>
                                <i class="fa fa-video-camera ms-2" aria-hidden="true"></i>
                                <i class="fa fa-chevron-down ms-2" aria-hidden="true"></i>
                            </li>
                            <li class="item-list-element">
                                <div class="checkbox-label label-comparison" data-io-label="comparison">
                                    <input type="checkbox" name="chb_${diamond.pk}" id="chb_${diamond.pk}" class="d-none checkbox checkbox-results">
                                    <i class="fa fa-check" aria-hidden="true"></i>
                                </div>
                            </li>
                            <li class="item-list-element">
                                <span class="me-2 shape-text-info">Shape:</span>
                                <span>${diamond.fields.shape}</span>
                            </li>
                            <li class="item-list-element">
                                <span class="item-list-element--info">Disc%:</span>
                                <span>5%</span>
                            </li>
                            <li class="item-list-element">
                                <span class="item-list-element--info">Price:</span>
                                <span>$${diamond.fields.sale_price}</span>
                            </li>
                            <li class="item-list-element">
                                <span class="item-list-element--info">Carat:</span>
                                <span>${diamond.fields.weight}</span>
                            </li>
                            <li class="item-list-element">
                                <span class="item-list-element--info">Cut:</span>
                                <span>${diamond.fields.cut}</span>
                            </li>
                            <li class="item-list-element">
                                <span class="item-list-element--info">Color:</span>
                                <span>${diamond.fields.color}</span>
                            </li>
                            <li class="item-list-element">
                                <span class="item-list-element--info">Clarity:</span>
                                <span>${diamond.fields.clarity}</span>
                            </li>
                            <li class="item-list-element">
                                <span class="item-list-element--info">T%:</span>
                                <span>${diamond.fields.table_procent}%</span>
                            </li>
                            <li class="item-list-element">
                                <span class="item-list-element--info">D%:</span>
                                <span>${diamond.fields.depth_procent}%</span>
                            </li>
                            <li class="item-list-element">
                                <span class="item-list-element--info">L/W:</span>
                                <span>${diamond.fields.lw}</span>
                            </li>
                            <li class="item-list-element">
                                <span class="item-list-element--info">Report:</span>
                                <span>${diamond.fields.lab}</span>
                            </li>
                        </ul>
                        <div class="result__drop-down border-top">
                            <div class="row">
                                <div class="result__drop-down--col col-3">
                                    <img src="${photo}" alt="" class="img-fluid rounded">
                                </div>
                                <div class="result__drop-down--col col-7">
        
                                    <h4 class="h4 py-2">${diamond.fields.weight} Carat Pear Lab Diamond</h4>
        
                                    <h5 class="h5 py-2">$${diamond.fields.sale_price}</h5>
        
                                    <ul class="list result__info-list">
        
                                        <li class="py-3 border-bottom result__info-li">
                                            <span>Carat: ${diamond.fields.weigth}</span>
                                        </li>
                                        <li class="py-3 border-bottom result__info-li">
                                            <span>Color: ${diamond.fields.color}</span>
                                        </li>
                                        <li class="py-3 border-bottom result__info-li">
                                            <span>Clarity: ${diamond.fields.clarity}</span>
                                        </li>
                                        <li class="py-3 border-bottom result__info-li">
                                            <span>Cut: ${diamond.fields.cut}</span>
                                        </li>
                                        <li class="py-3 border-bottom result__info-li">
                                            <span>Polish: ${diamond.fields.polish}</span>
                                        </li>
                                        <li class="py-3 border-bottom result__info-li">
                                            <span>Symmetry: ${diamond.fields.symmetry}</span>
                                        </li>
                                        <li class="py-3 border-bottom result__info-li">
                                            <span>Table: ${diamond.fields.table_procent}%</span>
                                        </li>
                                        <li class="py-3 border-bottom result__info-li">
                                            <span>Depth: ${diamond.fields.depth_procent}%</span>
                                        </li>
                                        <li class="py-3 border-bottom result__info-li">
                                            <span>L/W: ${diamond.fields.lw}</span>
                                        </li>
                                        <li class="py-3 border-bottom result__info-li">
                                            <span>Measurements: ${diamond.fields.measurements}</span>
                                        </li>
                                    </ul>
        
                                    <div class="acordion">
                                        <button type="button" class="acordion__btn btn-more--info">
                                            Additional Details
                                            <i class="fa fa-chevron-down ms-2" aria-hidden="true"></i>
                                        </button>
                                        <div class="acordion__body body-more--info border-top w-100">
                                            <ul class="list result__drop-list">
                                                <li class="result__drop-li">
                                                    <span>Culet: ${diamond.fields.culet}</span>
                                                </li>
                                                <li class="result__drop-li">
                                                    <span>Gridle: Thick - ${diamond.fields.girdle}</span>
                                                </li>
                                                <li class="result__drop-li">
                                                    <span>Report №: ${diamond.fields.cert_number}</span>
                                                </li>
                                                <li class="result__drop-li">
                                                    <span>Fluour: ${diamond.fields.fluor}</span>
                                                </li>
                                                <li class="result__drop-li">
                                                    <span>Origin: Lab grown Diamond</span>
                                                </li>
                                                <li class="result__drop-li">
                                                    <span class="d-flex w-100 flex-column">
                                                        <span>Lab Created Diamond Delivery:</span>
                                                        <span class="text-nowrap delivery_date">${delivery.day}, ${delivery.month} ${delivery.dayNum}</span>
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
        
                                </div>
                                <div
                                    class="result__drop-down--col col-2 d-flex flex-column justify-content-center align-items-center">
                                    <button type="button" class="btn btn-primary-border py-3 w-100 text-capitalize">
                                        View Diamond
                                    </button>
                                    <p class="mt-3 w-100 d-flex justify-content-center">
                                        <i class="fa fa-heart me-2 text-primary" aria-hidden="true"></i>
                                        <span>Only One Available</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    // --> insert diamond
                    context.containerComparison.insertAdjacentHTML('afterbegin', diamondHTML);
                });
                // set accordion
                context.accordion(context.containerComparison, '.label-comparison');

                // set comparison labels
                context.comparisonSelect(context);

            }, 200);

        }
        else {
            context.containerComparison.innerHTML = empty;
        }


    }

    // Set comparison length button
    setComparisonLength(key = 'comparison') {

        // * get storage values
        const storage = JSON.parse(localStorage.getItem(key));

        // * get length
        let length = 0;
        if (storage !== null) {
            length = storage.length;
        }
            

        // --> set length
        this.comparisonLength.textContent = length;
        if (length !== 0) { this.addToCartLength.textContent = `(${length})`; }
        else { this.addToCartLength.textContent = ``; }

    }

    // Get comparison Diamonds
    getComparison(extension = Function, key = 'comparison') {
        
        // * get storage selected
        const storage = JSON.parse(localStorage.getItem(key));

        // ? if storage exists
        if (storage !== null && storage.length !== 0) {
            
            // * get formated pk
            const pk = storage.map((value) => value.replace('chb_', ''));

            // * data for request
            this.control.data.comparisonKeys = pk;

            // --> create ajax
            ajax('filtering/of/key/', this.control.data, extension, this);

        }

        return this;
    }
    
    // Get selected in comparison / checkbox / name / diamond
    getComparisonChecked(checkboxes) {
        const checked = [];
        const checkedName = [];
        const checkedDiamonds = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked == true) {
                checked.push(checkbox);
                checkedName.push(checkbox.getAttribute('name'));
                checkedDiamonds.push(checkbox.closest('[data-io-diamond="comparison"]'));
            }
        });
        return {
            checkbox: checked,
            names: checkedName,
            diamonds: checkedDiamonds
        };
    }

    // Possibility to choose chb in comparison
    comparisonSelect() {

        // * diamond label
        const labels = new ElementsControl({
            parent: this.containerComparison,
            manager: '[data-io-label="comparison"]',
            managed: '.checkbox-results'
        });


        // --> init select func
        labels.label(
            // checked
            () => {
                // <-- get checked item and name
                this.comparisonCheckboxes = this.getComparisonChecked(labels.managed);
            },
            // unchecked
            () => {
                // <-- get checked item and name
                this.comparisonCheckboxes = this.getComparisonChecked(labels.managed);
            }
        );
    }

    // comparison show selected
    comparisonSelected() {
        
        const names = this.comparisonCheckboxes.names;

        const chbs = names.map(name => {
            const chb = this.containerComparison.querySelector(`#${name}`);
            chb.checked = true;
            return chb;
        });

        const labels = chbs.map(chb => {
            const label = chb.parentElement;
            label.classList.add('active');
            return label;
        });
    }

    // @ Delete selected comparison
    comparisonDeleteSelected(key = 'comparison') {
        this.comparisonDelete.addEventListener('click', () => {
            if (this.comparisonCheckboxes !== undefined && this.comparisonCheckboxes.names.length !== 0) {
                // * get storage data
                const storage = JSON.parse(localStorage.getItem(key));

                // * get selected names
                const selected = this.comparisonCheckboxes.names;

                // * get selected names
                const selectedDiamonds = this.comparisonCheckboxes.diamonds;

                // --> remove names from selected
                selected.forEach(name => {
                    const index = storage.indexOf(name);
                    if (index !== -1) {storage.splice(index, 1);}
                });

                // --> save new data of storage
                localStorage.setItem(key, JSON.stringify(storage));

                // --> remove elements from DOM
                selectedDiamonds.forEach(diamond => {
                    diamond.remove();
                });


                this.selected();
                this.setComparisonLength();

                // --> update view
                const compLabels = this.getElements('[data-io-label="comparison"]');
                const compCheckboxes = this.getChilds('.checkbox-results', compLabels);
                compLabels.map(label => { label.classList.remove('active'); });
                compCheckboxes.map(chb => { chb.checked = false; });
            }
        });
    }

    // @ Delete all comparison
    comparisonDeleteAll(key = 'comparison') {
        this.comparisonClear.addEventListener('click', () => {
            // --> clear storage
            localStorage.setItem(key, JSON.stringify([]));

            // * get selected comparison diamonds
            const comparisonDiamond = this.containerComparison.querySelectorAll('[data-io-diamond="comparison"]');
            
            // --> remove diamonds from DOM
            comparisonDiamond.forEach(diamond => {
                diamond.remove();
            });

            // --> update view
            this.selected();
            this.setComparisonLength();
        });
    }
    
    // <-- Get query set by filter data
    filter(responce, context = this, rules = 'all') {
        
        // * get result responce data
        const result = JSON.parse(responce.result);
        const resultLen = responce.resultLen;
        
        // * get best responce data
        const best = JSON.parse(responce.best);
        const bestLen = responce.bestLen;

        // --> create view params - result \ best
        const resultParams = {
            diamonds: result,
            parent: context.containerResult,
            len: resultLen,
            lenInfo: context.resultsLength,
        };
        const bestParams = {
            diamonds: best,
            parent: context.containerBest,
            len: bestLen,
            lenInfo: context.bestLength,
        };


        // --> set rules of creation
        if (rules == 'all') {
            context.view(resultParams);
            context.view(bestParams);
        }
        else if (rules == 'result') {context.view(resultParams); }
        else if (rules == 'best') { context.view(bestParams); }

        context.ordinal['best'] = [0, 40];
        context.ordinal['result'] = [0, 40];

    }

    // * show filter result
    filterShowButton() {
        if (document.documentElement.getBoundingClientRect().width <= 768) {
            const container = document.querySelector('#filters-container');
            const filterButton = container.querySelector('#show_filter_result');

            filterButton.onclick = () => {
                container.classList.remove('active');
                // --> Ajax Request
                ajax('filtering/', this.control.data, this.filter, this);
            }
        }
    }

    // --> view diaomnd
    view(kwargs) {

        // * get kwargs
        const emptyText = kwargs.emptyText || 'Nothing found for your request',
              lenInfo = kwargs.lenInfo,
              len = kwargs.len,
              context = kwargs.context || this,
              parent = kwargs.parent,
              diamonds = kwargs.diamonds,
              direction = kwargs.direction || 'beforeend';


        // * create empty HTML text
        const empty = `
        <div class="text-center text-primary py-4 border shadow-sm w-100 bg-lite">
            <p class="fs-5 py-2 m-0">
                ${emptyText}
            </p>
        </div>
        `;

        // * create spiner in parent view
        parent.innerHTML = context.spiner();

        setTimeout(() => {

            // * clear parent html
            parent.innerHTML = '';

            // * update diamonds list
            if (diamonds.length !== undefined && diamonds.length !== 0) {

                // --> create diamonds
                diamonds.map(diamond => {
                    parent.insertAdjacentHTML(direction, getDiamondHTML(diamond));
                    lenInfo.textContent = len;
                });

                // --> set ability

                // set comparison labels
                context.accordion(parent);
                context.select(parent, context);
                context.selected();

            }
            else {
                parent.innerHTML = empty;
                lenInfo.textContent = 0;
            }
        }, 200);

    }

    // * update cart
    updateCart(responce, context, key) {

        // get len from responce
        const len = responce.cart_len
        
        // create element
        const lenElem = `
            <span id="cart_length">${len}</span>
        `

        // get len item
        const cartlen = document.querySelector('#cart_length');

        // remove if exist
        if (cartlen !== undefined && cartlen !== null) { cartlen.remove(); }

        // insert cart len
        context.cartLink.insertAdjacentHTML('beforeend', lenElem);

        // cart notification
        context.cartNotification('set', responce.update_len);

        setTimeout(() => {
            context.cartNotification('remove');
        }, 1800);
    }

    // --> add diamond in to the cart
    sendToCart() {
        this.addToCart.onclick = () => {

            // get keys
            const storage = JSON.parse(localStorage.getItem('comparison'));
            const keys = storage.map(value => { return value.replace('chb_', '') });

            if (keys.length !== 0) {
                // clear comparison
                let event = new Event("click");
                this.comparisonClear.dispatchEvent(event);
                
                // send ajax
                ajax('/cart/pack/', keys, this.updateCart, this);
            }
        }
    }

    // * cart update notification
    cartNotification(action, len) {
        const notification = `
            <div class="cart-notification w-100 h-100 d-flex align-items-center justify-content-center" id="cart-update-notification">

                <div class="cart-notification-body d-flex flex-column align-items-center justify-content-center bg-white rounded shadow-sm py-4 px-5">
            
                    <div class="cart-notification-logo">
                        <img src="/static/img/logo/LaBrilliante.svg" alt="">
                    </div>

                    <div class="cart-notification-title mt-3">
                        <h2 class="h2 text-center">
                            <span class="cart-notification__diamonds-length text-primary">${len}</span>
                            New stones have been added to the basket
                        </h2>
                    </div>
            
                </div>
        
            </div>
        `;
        
        if (action == 'set') {
            const wrapper = document.querySelector('.wrapper');
            if (len !== 0) {
                wrapper.insertAdjacentHTML('afterbegin', notification);
            }
        }
        else if (action == 'remove') {
            const notificationElement = document.querySelector('#cart-update-notification');

            if (notificationElement !== undefined && notificationElement !== null) {
                notificationElement.classList.add('cart-notification-hide');
                setTimeout(() => {
                    notificationElement.remove();
                }, 300);
            }
        }
    }
}

// // @ -------------------------------- Scrolling
class InfinityScrolling {

    constructor(kwargs) {

        // * data control
        this.control = kwargs.control;

        // * view contro
        this.viewControl = kwargs.view;

        // * get tdiamonds contaier
        this.container = kwargs.container;
        
        // * permissions
        this.permission = {
            next: false,
            prev: false
        };

        // * diamonds items
        this.diamondsItems = [];

        // * key
        this.key = 'result';

        // * ordinal
        this.ordinal = [0, 40];

        // * insert ordering
        this.direction = 'beforeend';

        // --> init
        this.init();
    }

    init() {
        setTimeout(() => {
            this.permission = {
                next: true,
                prev: false
            };
        }, 200);
    }

    // debug
    debug(info = this) {
        console.log(info);
    }

    // set ability for diamonds
    setAbility(context) {

        // --> accordion init
        context.viewControl.accordion(context.viewControl.containerResult);
        context.viewControl.accordion(context.viewControl.containerBest);

        // --> label init
        context.viewControl.labelResul = context.viewControl.select(context.viewControl.containerResult);
        context.viewControl.labelBest = context.viewControl.select(context.viewControl.containerBest);

        // --> set selected
        context.viewControl.selected();
    }
    
    //  spiner
    spiner(action = 'get') {
        if (action == 'get') {
            const spin =
            `
            <div class="text-center text-primary py-4 shadow-sm w-100 bg-lite border-bottom border-top my-1" id="loading-spiner">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            `
            return spin;
        }
        else if (action == 'remove') {
            const spin = this.container.querySelector('#loading-spiner');
            if (spin !== undefined && spin !== null) {
                spin.remove();
            }
        }
        else if (action == 'has') {
            const spin = this.container.querySelector('#loading-spiner');
            if (spin !== undefined && spin !== null) {
                return true;
            } else {
                return false;
            }
        }
    }

    // * remove some diamond
    removeDiamonds(diamonds = Array, from = 'beforeend') {

        // create nodes
        let nodes = [];

        let x = diamonds.length - 60;

        if (x > 0) {
            if (from == 'beforeend') {
                diamonds.map((diamond, index) => {
                    if (index <= x) { diamond.remove(); }
                    else { nodes.push(diamond); }
                });
            }
            else if (from == 'afterbegin') {
                diamonds.reverse();
                diamonds.map((diamond, index) => {
                    if (index <= x) { diamond.remove(); }
                    else { nodes.push(diamond); }
                });
                nodes = diamonds.reverse();
            }
        }

        this.diamondsItems = nodes;
    }

    // * view diamonds
    cursor(move = 'next') {

        // * get current start / end
        let start = this.ordinal[0];
        let end = this.ordinal[1];

        // * create request ordinal arr
        let reqOrdinal = [];

        // ! move cursor
        if (move == 'next') {
            end += 20
            if (end > 60) {
                start += 20;
            }
            reqOrdinal = [end - 19, end];
        }
        else if (move == 'prev') {
            // break point
            if (start == 0) {
                this.permission.prev = false;
                return false;
            }
            // move prev
            else {
                reqOrdinal = [start - 20, start];
                start -= 20;
                end -= 20;
            }
        }
        console.log(this);
        // ! update data values
        this.ordinal = [start, end];
        this.control.data.ordinal[this.key] = reqOrdinal;
        this.control.ordinal[this.key] = reqOrdinal;
    }

    // * view diamonds
    view(responce, context, key) {

        if (context.stop !== undefined && context.stop === false) {
            // <-- get queryset
            let queryset = JSON.parse(responce[context.key]);

            setTimeout(() => {
                // @ remove spiner
                if (context.spiner('has')) {
                    context.spiner('remove');
                }

                // * update diamond list
                if (queryset.length > 0) {
                    // add new diamonds
                    if (context.direction == 'afterbegin') { queryset = queryset.reverse(); }
                    queryset.map(diamond => {
                        context.container.insertAdjacentHTML(context.direction, getDiamondHTML(diamond));
                    });
                    // remove old diamonds
                    const diamons = [...context.container.querySelectorAll('.result-section--element')];
                    context.diamondsItems = diamons;
                    context.removeDiamonds(diamons, context.direction);

                    // set permission next
                    context.permission.next = true;

                    // set permission prev
                    if (context.ordinal[0] > 0) {
                        context.permission.prev = true;
                    } else {
                        context.permission.prev = false;
                    }

                    // set abilitys
                    context.setAbility(context);
                }
                else {
                    context.permission.prev = true;
                    context.permission.next = false;
                }
            }, 300);
        } else {
            // @ remove spiner
            if (context.spiner('has')) {
                context.spiner('remove');
            }
        }
    }

    // --> get next diamonds
    next() {
        if (this.permission.next === true) {
            this.stop = false;
            if (!this.spiner('has')) {
                this.container.insertAdjacentHTML(this.direction, this.spiner('get'));
                this.container.scrollTo(0, this.container.scrollHeight - 5);
            }
            
            // set direction
            this.direction = 'beforeend';
            
            // set permission false
            this.permission.next = false;
            this.permission.prev = false;
            
            // --> move cursor
            const move = this.cursor('next');
            
            // --> send ajax
            if (move !== false) {
                ajax('filtering/', this.control.data, this.view, this);
            }
        }
    }
    
    // <-- get prev diamonds
    prev() {
        if (this.permission.prev === true) {
            this.stop = false;
            if (!this.spiner('has')) {
                this.container.insertAdjacentHTML(this.direction, this.spiner('get'));
                this.container.scrollTo(0, 5);
            }

            // set direction
            this.direction = 'afterbegin';

            // set permission false
            this.permission.next = false;
            this.permission.prev = false;

            // --> move cursor
            this.cursor('prev');

            // --> send ajax
            ajax('filtering/', this.control.data, this.view, this);
        }
    }

    // @ set default
    default() {
        // set permission false
        this.permission.next = false;
        this.permission.prev = false;

        // set ordinal values default
        this.ordinal = [0, 40];
        this.control.data.ordinal[this.key] = [0, 40];
        this.control.ordinal[this.key] = [0, 40];

        // set permission true after 300 ms
        setTimeout(() => {
            this.permission.next = true;
        }, 300);
    }

}

document.addEventListener("DOMContentLoaded", () => {

    // * share link
    const kwargs = {
        tigger: '#share-link',
        container: '#share-links-modal',
        exit: '#share-modal-close',
        with: '#share-with-price',
        without: '#share-without-price',
        key: 'comparison',
        url: '/share/create/',
        messageBox: '#messageBox',
    }
    const share = new ShareLink(kwargs).init();

    // * --------------------------------------------------------- Data
    const FilterForm = document.querySelector('#filters-container');
    const control = new DataControl({
        parent: FilterForm,
        cleanButton: '#reset-filter',
        chb: '.diamond-filter-chb'
    });

    // * --------------------------------------------------------- View
    const diamondsView = new DiamondView({
        parent: '#pills-tabContent',
        result: '#result__items',
        best: '#best__items',
        comparison: '#comparison__items',
        comparisonLength: '#comparison-lenth',
        comparisonClear: '#comparison-delet-all',
        comparisonDelete: '#comparison-delet-selected',
        addToCart: '#add-to-cart-selected-diamonds',
        addToCartLength: '#add-to-cart-lenght',
        resultsLength: '#result-length',
        bestLength: '#best-length',
        control: control,
        showFilterResult: '#show_filter_result',
        cart_link: '.header_cart-btn'
    });

    // * --------------------------------------------------------- infinity scroll
    const resultMore = new InfinityScrolling({
        control: control,
        view: diamondsView,
        container: diamondsView.containerResult,
        key: 'result'
    });

    // * --------------------------------------------------------- Sort
    const sortResult = new Sort({
        
        simple: '#result-simple-sort',
        simpleElems: '[data-io-simple-sort]',
        simpleElemsShow: '[data-io-sort="show"]',

        advanced: '#result-sort-modal',
        dragList: '#result-name-priority',
        typeList: '#result-name-sort',

        advancedElems: '[data-io-advanced-sort]',

        key: 'result',

        angle: '.fa-angle-down',
        plus: '.sort-plus',
        handle: '.drag-handle',

        control: control,
        view: diamondsView,
        ajax: {
            func: ajax,
            url: 'filtering/',
        }

    });
    
    const sortBest = new Sort({
        
        simple: '#best-simple-sort',
        simpleElems: '[data-io-simple-sort]',
        simpleElemsShow: '[data-io-sort="show"]',

        advanced: '#best-sort-modal',
        dragList: '#best-name-priority',
        typeList: '#best-name-sort',

        advancedElems: '[data-io-advanced-sort]',

        angle: '.fa-angle-down',
        plus: '.sort-plus',
        handle: '.drag-handle',

        key: 'best',

        control: control,
        view: diamondsView,
        ajax: {
            func: ajax,
            url: 'filtering/',
        }

    });

    const sortComparison = new Sort({
    
        simple: '#comparison-simple-sort',
        simpleElems: '[data-io-simple-sort]',
        simpleElemsShow: '[data-io-sort="show"]',

        advanced: '#comparison-sort-modal',
        dragList: '#comparison-name-priority',
        typeList: '#comparison-name-sort',

        advancedElems: '[data-io-advanced-sort]',

        angle: '.fa-angle-down',
        plus: '.sort-plus',
        handle: '.drag-handle',

        key: 'comparison',

        control: control,
        view: diamondsView,
        ajax: {
            func: ajax,
            url: 'filtering/of/key/',
        }

    });
    
    sortResult.init();
    sortBest.init();
    sortComparison.init();
   
    // * --------------------------------------------------------- NoUI

    // numeric sliders
    function numUI() {
        //  * price Slider
        const carat_values = getMaxMin('#range_carat');
        const depth_values = getMaxMin('#range_depth');
        const depth_procent_values = getMaxMin('#range_depth_procent');
        const length_values = getMaxMin('#range_length');
        const price_values = getMaxMin('#range_price');
        const ratio_values = getMaxMin('#range_lw');
        const table_values = getMaxMin('#range_table');
        const width_Values = getMaxMin('#range_width');

        // * price noUI
        const priceOptions = {
            infinity: {
                result: resultMore
            },
            parent: FilterForm,
            selector: '#price-range',
            control: control,
            inputs: {
                min: '#input-price-min',
                max: '#input-price-max',
            },
            options: {
                start: [price_values.min, price_values.max],
                connect: true,
                step: 1,
                tooltips: true,
                range: {
                    min: price_values.min,
                    max: price_values.max,
                },
                format: {
                    to: function (value) {
                        return parseInt(value) + "$";
                    },
                    from: function (value) {
                        return parseInt(value);
                    },
                },
            },
            key: 'sale_price'
        };
        const price = new UI(priceOptions).num(diamondsView.filter, diamondsView);

        // * carat noUI
        const caratOptions = {
            infinity: {
                result: resultMore
            },
            parent: FilterForm,
            selector: '#carat-range',
            control: control,
            inputs: {
                min: '#input-carat-min',
                max: '#input-carat-max',
            },
            options: {
                start: [carat_values.min, carat_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: carat_values.min,
                    max: carat_values.max,
                },
            },
            key: 'weight'
        };
        const carat = new UI(caratOptions).num(diamondsView.filter, diamondsView);

        // * Lw-Ratio noUI
        const lwRatioParams = {
            infinity: {
                result: resultMore
            },
            parent: FilterForm,
            key: 'lw',
            control: control,
            selector: "#lw-ratio-range",
            inputs: {
                min: "#input-lw-ratio-min",
                max: "#input-lw-ratio-max",
            },
            options: {
                start: [ratio_values.min, ratio_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: ratio_values.min,
                    max: ratio_values.max,
                },
            },
        };
        const lwRatio = new UI(lwRatioParams).num(diamondsView.filter, diamondsView);

        // * Table noUI
        const tableParams = {
            infinity: {
                result: resultMore
            },
            parent: FilterForm,
            key: 'table_procent',
            control: control,
            inputs: {
                min: "#input-table-min",
                max: "#input-table-max",
            },
            selector: "#table-range",
            options: {
                start: [table_values.min, table_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: table_values.min,
                    max: table_values.max,
                },
            },
        };
        const table = new UI(tableParams).num(diamondsView.filter, diamondsView);

        // * Depth noUI
        const depthParams = {
            infinity: {
                result: resultMore
            },
            parent: FilterForm,
            key: 'depth_procent',
            control: control,
            inputs: {
                min: "#input-depth-min",
                max: "#input-depth-max",
            },
            selector: "#depth-range",
            options: {
                start: [depth_procent_values.min, depth_procent_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: depth_procent_values.min,
                    max: depth_procent_values.max,
                },
            },
        };
        const depth = new UI(depthParams).num(diamondsView.filter, diamondsView);

        // * Length noUI
        const lengthParams = {
            infinity: {
                result: resultMore
            },
            parent: FilterForm,
            key: 'length',
            control: control,
            inputs: {
                min: "#input-length-min",
                max: "#input-length-max",
            },
            selector: "#length-range",
            options: {
                start: [length_values.min, length_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: length_values.min,
                    max: length_values.max,
                },
            },
        };
        const length = new UI(lengthParams).num(diamondsView.filter, diamondsView);

        // * Width noUI
        const widthParams = {
            infinity: {
                result: resultMore
            },
            parent: FilterForm,
            key: 'width',
            control: control,
            inputs: {
                min: "#input-width-min",
                max: "#input-width-max",
            },
            selector: "#width-range",
            options: {
                start: [width_Values.min, width_Values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: width_Values.min,
                    max: width_Values.max,
                },
            },
        };
        const width = new UI(widthParams).num(diamondsView.filter, diamondsView);

        // * DepthMM noUI
        const depthmmParams = {
            infinity: {
                result: resultMore
            },
            parent: FilterForm,
            key: 'depth',
            control: control,
            inputs: {
                min: "#input-depth-mm-min",
                max: "#input-depth-mm-max",
            },
            selector: "#depth-mm-range",
            options: {
                start: [depth_values.min, depth_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: depth_values.min,
                    max: depth_values.max,
                },
            },
        };
        const depthmm = new UI(depthmmParams).num(diamondsView.filter, diamondsView);

    } numUI();

    // string sliders
    function strUI() {

        // *  cut noUI
        const cutOptions = {
            infinity: {
                result: resultMore
            },
            key: 'cut',
            control: control,
            parent: FilterForm,
            selector: '#cut-range',
            tooltips: true,
            pips: ".noUi-value",
            pipsName: ["Fair", "Good", "Very Good", "Ideal", "Super Ideal"],
            options: {
                start: [1, 5],
                connect: true,
                step: 1,
                range: {
                    min: 1,
                    max: 5,
                },
                pips: {
                    mode: "positions",
                    values: [1, 25, 50, 75, 96],
                    density: 1,
                    steped: true,
                },
            }
        };
        const cut = new UI(cutOptions).str(diamondsView.filter, diamondsView);

        // *  Color noUI
        const colorParams = {
            infinity: {
                result: resultMore
            },
            key: 'color',
            control: control,
            parent: FilterForm,
            selector: "#color-range",
            tooltips: true,
            pips: ".noUi-value",
            pipsName: ["M", "L", "K", "J", "I", "H", "G", "F", "E", "D"],
            options: {
                start: [1, 10],
                connect: true,
                step: 1,
                range: {
                    min: 1,
                    max: 10,
                },
                pips: {
                    mode: "count",
                    values: 10,
                    density: 1,
                },
            },
        };
        const color = new UI(colorParams).str(diamondsView.filter, diamondsView);

        // *  Clarity noUI
        const clarityParams = {
            infinity: {
                result: resultMore
            },
            key: 'clarity',
            parent: FilterForm,
            control: control,
            selector: "#clarity-range",
            tooltips: true,
            pips: ".noUi-value",
            pipsName: [
                "I2",
                "I1",
                "SI2",
                "SI1",
                "VS2",
                "VS1",
                "VVS2",
                "VVS1",
                "IF",
                "FI",
            ],
            options: {
                start: [1, 10],
                connect: true,
                step: 1,
                range: {
                    min: 1,
                    max: 10,
                },
                pips: {
                    mode: "count",
                    values: 10,
                    density: 1,
                },
            },
        };
        const clarity = new UI(clarityParams).str(diamondsView.filter, diamondsView);

        // *  Symmetry noUI
        const symmetryParams = {
            infinity: {
                result: resultMore
            },
            key: 'symmetry',
            parent: FilterForm,
            control: control,
            selector: "#symmetry-range",
            tooltips: true,
            pips: ".noUi-value",
            pipsName: ["Good", "Very Good", "Excellent"],
            options: {
                start: [1, 3],
                connect: true,
                step: 1,
                range: {
                    min: 1,
                    max: 3,
                },
                pips: {
                    mode: "positions",
                    values: [2, 50, 96],
                    density: 1,
                },
            },
        };
        const symmetry = new UI(symmetryParams).str(diamondsView.filter, diamondsView);

        // * Polish noUI
        const polishParams = {
            infinity: {
                result: resultMore
            },
            key: 'polish',
            parent: FilterForm,
            control: control,
            selector: "#polish-range",
            tooltips: true,
            pips: ".noUi-value",
            pipsName: ["Good", "Very Good", "Excellent"],
            options: {
                start: [1, 3],
                connect: true,
                step: 1,
                range: {
                    min: 1,
                    max: 3,
                },
                pips: {
                    mode: "positions",
                    values: [2, 50, 96],
                    density: 1,
                },
            },
        };
        const polish = new UI(polishParams).str(diamondsView.filter, diamondsView);

        // * Fluour noUI
        const fluourParams = {
            infinity: {
                result: resultMore
            },
            key: 'fluor',
            parent: FilterForm,
            control: control,
            selector: "#fluor-range",
            tooltips: true,
            pips: ".noUi-value",
            pipsName: ["None", "Faint", "Medium", "Strong", "Very Strong"],
            options: {
                start: [1, 5],
                connect: true,
                step: 1,
                range: {
                    min: 1,
                    max: 5,
                },
                pips: {
                    mode: "positions",
                    values: [2, 26, 50, 74, 97],
                    density: 1,
                },
            },
        };
        const fluour = new UI(fluourParams).str(diamondsView.filter, diamondsView);

    } strUI();

    // checkbox
    function boolFilter() {

        const shapesOptions = {
            infinity: {
                result: resultMore
            },
            control: control,
            parent: FilterForm,
            key: 'shape',
            checkbox: '.shape-checkbox'
        };
        const shapes = new UI(shapesOptions).bool('shape', diamondsView.filter, diamondsView);

        const labOptions = {
            infinity: {
                result: resultMore
            },
            control: control,
            parent: FilterForm,
            key: 'lab',
            checkbox: '.report-lab-checkbox'
        };
        const labshapes = new UI(labOptions).bool('lab', diamondsView.filter, diamondsView);



    } boolFilter();

    // filter - resize / drop-down / hide / show / jump...
    function filterView() {
        // * -------------------------- filter drop down
        const filterDropDown = new ElementsControl({
            parent: '.diamonds-filter-container',
            manager: "#filter-more",
            managed: "#filter-acordion-body",
        });
        filterDropDown.toggler();

        // * -------------------------- filter more
        const filterMore = new ElementsControl({
            parent: filterDropDown.parent,
            manager: "#filter-more-btn",
            managed: "#filter-2",
        });
        filterMore.toggler();

        // * -------------------------- filter col
        const filterCol = new ElementsControl({
            parent: filterDropDown.parent,
            manager: ".filter-info",
            managed: ".filter-item",
        });
        filterCol.toggler({ single: true });

        // * -------------------------- filter show
        const filterShow = new ElementsControl({
            parent: filterDropDown.parent,
            manager: "#filters-container-toggler",
            managed: "#filters-container",
        });
        filterShow.toggler();

        // * -------------------------- filter hide
        const filterHide = new ElementsControl({
            parent: filterDropDown.parent,
            manager: "#filter-exit-btn",
            managed: "#filters-container",
        });
        filterHide.toggler();

        // * -------------------------- filter advanced
        const filterAdvenced = new ElementsControl({
            parent: filterDropDown.parent,
            manager: "#filter-advenced-btn",
            managed: ".filter-row",
        });
        filterAdvenced.switcher();

        // * -------------------------- shape jump
        const shapeJump = new ElementsControl({
            parent: filterDropDown.parent,
            manager: "#filter-shape",
            managed: "#shape-jump-container",
        });
        shapeJump.screen(() => {
            shapeJump.jump("beforeend");
        });

        // * -------------------------- reset jump
        const resetJump = new ElementsControl({
            parent: filterDropDown.parent,
            manager: "#reset-filter",
            managed: "#filter-reset-container",
        });
        resetJump.screen(() => {
            resetJump.jump("beforeend");
        });
    } filterView();

    // filter diamond items scroll fix
    function scrollFix() {
        // * -------------------------- resutlScroll
        const resutlScroll = new ScrollFix({
            container: '#result__items',
            extensionBottom: () => {
                resultMore.next();
            },
            extensionTop: () => {
                resultMore.prev();
            }
        });
        
        // * -------------------------- bestlScroll
        const bestlScroll = new ScrollFix({
            container: '#best__items'
        });
        
        // * -------------------------- comparisonlScroll
        const comparisonlScroll = new ScrollFix({
            container: '#comparison__items'
        });
 
    } scrollFix();


    // filter clear
    control.infinity = {
        result: resultMore,
    }
    control.cleanFilter(diamondsView.filter, diamondsView);
    
    // * get delivery date
    const date = deliveryDate('set');

});
