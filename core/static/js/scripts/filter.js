"use strict";

// -- Control Ancestor
class Control {
    
    constructor(kwargs) {}

    // -- Debug - log
    _debug(info = this) {
        console.log(info);
        return this;
    }

    // -- Get Dom Elements
    _getElement(selector, parent = document) {
        return parent.querySelector(selector)
    }
    _getElements(selector, parent = document) {
        return [...parent.querySelectorAll(selector)]
    }
    _getChilds(selector, elements = Array) {
        const nodes = [];
        
        elements.map(element => {
            const nodeList = [...element.querySelectorAll(selector)];
            nodeList.map(node => nodes.push(node));
        });
        return nodes;
    }
    _getElementsList(list, parent) {
        const nodes = [];
        list.map(value => {
            nodes.push(this._getElement(value, parent));
        });
        return nodes;
    }

    // -- HTML View
    spinerView(action = 'get', container) {
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
            if (container == undefined) { container = this.container; }
            const spin = container.querySelector('#loading-spiner');
            if (spin !== undefined && spin !== null) {
                spin.remove()
            }
        }
        else if (action == 'has') {
            if (container == undefined) { container = this.container; }
            const spin = container.querySelector('#loading-spiner');
            if (spin !== undefined && spin !== null) {
                return true;
            } else {
                return false;
            }
        }
    }
    getDiamondHTML(diamond) {

        parent.innerHTML = '';

        let photo = ''

        // if (diamond.video != '' && diamond.video != '-' && diamond.video != 'N/A') {
        //     photo = `<iframe class="video_frame" src="${diamond.video}" frameborder="0"></iframe>`
        // }
        if (photo == 'N/A' || photo == '' || photo == '-') {
            photo = `<img src="${diamond.photo}" alt="" class="img-fluid rounded"></img>`
        }
        else {
            photo = '<img src="static/img/diamonds/base-diamond.jpg" alt="" class="img-fluid rounded"></img>'

        }

        const date = deliveryDate();

        const diamondHTML = `
        <div class="result__item result-section--element">
    
        <ul class="item-list result__item-list">
            <li class="item-list-element">
                <i class="item-shape svg-${diamond.fields.shape.toLowerCase()}"></i>
                <i class="fa fa-video-camera ms-2" aria-hidden="true"></i>
                <i class="fa fa-chevron-down ms-2" aria-hidden="true"></i>
            </li>
            <li class="item-list-element">
                <div class="checkbox-label label-result" data-io-label="diamonds-item">
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
                <span>${diamond.fields.disc}%</span>
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
                    ${photo}
                </div>
                
                <div class="result__drop-down--col col-7">
    
                    <h4 class="h4 py-2">1.01 Carat Pear Lab Diamond</h4>
    
                    <h5 class="h5 py-2">$${diamond.fields.sale_price}</h5>
    
                    <ul class="list result__info-list">
    
                        <li class="py-3 border-bottom result__info-li">
                            <span>Carat: ${diamond.fields.weight}</span>
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
                                    <span>Girdle: ${diamond.fields.gridle}</span>
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
                                        <span class="text-nowrap delivery_date">${date.day} ${date.dayNum} ${date.month}</span>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
    
                </div>
                
                <div class="result__drop-down--col col-2 d-flex flex-column justify-content-center align-items-center">
                    <p class="mt-3 w-100 d-flex justify-content-center">
                        <i class="fa fa-heart me-2 text-primary" aria-hidden="true"></i>
                        <span>Only One Available</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
        `;

        return diamondHTML;
    }
    getEmpty(message) {

        const html = `        
        <div class="text-center text-primary py-4 border shadow-sm w-100 bg-lite" id="empty-allert">
            <p class="fs-5 m-0">${message}</p>
        </div>
        `
        return html;

    }

    // --> view result
    updateView(responce, context) {

        // -- create diamonds var
        let diamonds;

        // -- update diamonds var
        if (context.key !== 'comparison') {
            diamonds = JSON.parse(responce[context.key]);
        }
        else {
            diamonds = responce;
        }

        // <-- get position
        const position = context.insertPosition || 'beforeend';

        // -- responce reverse
        if (context.responceReverse !== undefined && context.responceReverse !== null && context.responceReverse == true) {
            diamonds = diamonds.reverse();
        }

        // --> update diamonds view
        setTimeout(() => {
            context.spinerView('remove', context.container);
            diamonds.map(diamond => {
                context.container.insertAdjacentHTML(position, context.getDiamondHTML(diamond));
            });

            context.updateViewEnd(responce);
        }, 200);
    }

    

}

// @ Data Control
class DataControl {
    constructor() {

        // -- filter params
        this.filter = {
            shape: [],
            lab: [],
            strs: {},
            nums: {}
        }

        // -- current key
        this.currentKey = 'all'


        // -- sortable values
        this.sort = {
            result: ['sale_price'],
            best: ['sale_price'],
            comparison: ['sale_price'],
            
            compare: {
                result: false,
                best: false,
                comparison: false
            }
        }

        // -- selected compare keys 
        this.comparing = [];
        this.comparisonSelected = [];

        // -- infinity scroll params
        this.scrollLock = false;
        this.permissions = {
            result: {
                next: true,
                prev: false
            },
            best: {
                next: true,
                prev: false
            }
        }

        this.ordering = {
            result: [0, 45],
            best: [0, 45]
        }
        this.requestOrdering = {
            result: [0, 45],
            best: [0, 45],
        }
        this.maxOrder = {
            result: null,
            best: null
        }

        // -- params
        this.responceReverse = false;

    }
    dropInfinity() {
        // -- infinity scroll params
        this.scrollLock = true;

        this.permissions = {
            result: {
                next: true,
                prev: false
            },
            best: {
                next: true,
                prev: false
            }
        }
        this.ordering = {
            result: [0, 45],
            best: [0, 45]
        }
        this.requestOrdering = {
            result: [0, 45],
            best: [0, 45],
        }
        this.maxOrder = {
            result: null,
            best: null
        }
    }
}

// @ NoUI
class NoUI extends Control {

    constructor(kwargs) {
        super()

        this.data = {
            shape: [],
            lab: [],
            strs: {},
            nums: {}
        }
        this.dataControl = kwargs.dataControl;
        this.view = kwargs.view;
        this.url = kwargs.url;
        this.keys = [];

        // <-- Main Elements list
        this.parent = this._getElement(kwargs.parent);
        this.numericElements = this._getElements(kwargs.numericSliders, this.parent);
        this.strElements = this._getElements(kwargs.stringSliders, this.parent);
        this.labElements = this._getElements(kwargs.labInputs, this.parent);
        this.shapeElements = this._getElements(kwargs.shapeInputs, this.parent);
        this.cleanButton = this._getElement(kwargs.cleanButton, this.parent);
        this.numericInputs = [];

        // -- params
        this.sliders = [];

        // -- clean
        this.clean();
    }

    // <-- get max min values
    getMaxMin(selector) {
        const input = this._getElement(selector);
        const values = {
            max: Number(input.max),
            min: Number(input.min)
        }
        return values;
    }

    // -- create numeric sliders
    numeric(slider, settings) {

        // keys update
        const key = settings.options.key;
        this.keys.push(key);

        // get slider element and parent
        const sliderElement = this._getElement(slider);
        const parent = sliderElement.closest('.filter-item');

        // slider create + update sliders list
        const sliderObj = noUiSlider.create(sliderElement, settings.params);
        this.sliders.push(sliderObj)

        // -- get numeric input
        this.numericInputs[key] = {
            min: this._getElement('[data-numeric-input="min"]', parent),
            max: this._getElement('[data-numeric-input="max"]', parent)
        };
        
        // -- update numeric inputs
        sliderObj.on('update', () => {
            // <-- get value from slider
            const value = sliderObj.get();

            // -- set value in input
            this.numericInputs[key]['min'].value = value[0];
            this.numericInputs[key]['max'].value = value[1];

            // <-- get current min max value
            let currentMin = value[0];
            let currentMax = value[1];
            if (key == 'sale_price') {
                currentMin = currentMin.slice(0, currentMin.length -1);
                currentMax = currentMax.slice(0, currentMax.length - 1);
            }
            
            // <-- get default min max value
            const defaultMin = sliderObj.options.start[0]
            const defaultMax = sliderObj.options.start[1]

            // -- check differences and update nums data
            if (currentMin == defaultMin && currentMax == defaultMax) {
                delete (this.data.nums[key]);
            } else {
                this.data.nums[key] = [currentMin, currentMax];
            }
        });

        // -- input changers
        this.numericInputs[key]['min'].addEventListener('change', () => {
            sliderObj.set([this.numericInputs[key]['min'].value, null]);
            // --> apply changes
            this.apply();
        });
        this.numericInputs[key]['max'].addEventListener('change', () => {
            sliderObj.set([null, this.numericInputs[key]['max'].value]);
            // --> apply changes
            this.apply();
        });

        // --> apply changes
        sliderObj.on('change', () => {
            // --> apply changes
            this.apply();
        });

    }

    // -- create string sliders
    string(slider, settings) {

        // -- keys update
        const key = settings.options.key;
        this.keys.push(key);

        // <-- get slider element and parent
        const sliderElement = this._getElement(slider);
        const parent = sliderElement.closest('.filter-item');

        // -- slider create + update sliders list
        const sliderObj = noUiSlider.create(sliderElement, settings.params);
        this.sliders.push(sliderObj)

        // -- pips settings
        const pips = this._getElements('.noUi-value', parent);
        pips.map((pip, index) => {
            pip.textContent = settings.params.replacePips[index];
        });

        sliderObj.on('change', () => {
            
            // <-- get slider values
            const value = sliderObj.get()[1];
            const names = sliderObj.options.replacePips;

            // <-- get current string values
            const strValues = [];
            for (let i = 0; i < value; i++) {
                strValues.push(names[i]);
            }
            
            // -- check differences and update strs data
            if (strValues.length == names.length) {
                delete (this.data.strs[key]);
            } else {
                this.data.strs[key] = strValues;
            }

            this.apply();
            
        });
    }

    // -- create select input
    select(key) {

        // -- get inputs list
        let inputs;
        if (key === 'lab') {
            inputs = this.labElements;
        }
        else if (key === 'shape') {
            inputs = this.shapeElements;
        }

        // -- listen inputs
        inputs.map(input => {
            input.addEventListener('change', () => {
                const value = Number(input.value),
                    checked = input.checked,
                    shape = input.dataset.shape;
                // -- checked true
                if (checked) {
                    if (key == 'shape') {
                        this.data[key].push(shape);
                    }
                    else if (key == 'lab') {
                        this.data[key].push(input.dataset.labName);
                    }
                }
                // -- checked false
                else if (!checked) {
                    if (key == 'shape') {
                        this.data[key] = this.data[key].filter(v => { return v != shape; });
                    }
                    else if (key == 'lab') {
                        this.data[key] = this.data[key].filter(v => { return v != input.dataset.labName; });
                    }
                }

                this.apply();
            });
        });
    }

    // -- clean
    clean() {
        this.cleanButton.addEventListener('click', () => {
            // -- set data default
            this.data = {
                shape: [],
                lab: [],
                strs: {},
                nums: {}
            }

            // -- set sliders default
            this.sliders.map(slider => {
                slider.reset();
            });

            // -- set shape default
            this.shapeElements.map(shape => {
                shape.checked = false;
            });

            // -- set lab default
            this.labElements.map(shape => {
                shape.checked = false;
            });

            this.apply();

            // -- hide clean button
            this.cleaner();
        });
    }

    // -- cleaner
    cleaner() {
        if (Object.keys(this.data.nums).length === 0 && Object.keys(this.data.strs).length === 0 && this.data.lab.length === 0 && this.data.shape.length == 0) {
            this.cleanButton.classList.add('hidden');
            this.cleanButton.setAttribute('disabled', '');
        }
        else {
            this.cleanButton.classList.remove('hidden');
            this.cleanButton.removeAttribute('disabled');
        }
    }
    
    // --> apply data
    apply() {
        this.cleaner();

        // -- set keys
        this.currentKey = 'all';
        this.dataControl.currentKey = 'all';

        // -- set ordering default
        this.dataControl.ordering = {
            result: [0, 45],
            best: [0, 45]
        }
        this.dataControl.requestOrdering = {
            result: [0, 45],
            best: [0, 45],
        }

        // --> clean containers view and add spiner
        this.view.result.container.innerHTML = '';
        this.view.result.container.insertAdjacentHTML('afterbegin', this.spinerView('get'));

        this.view.best.container.innerHTML = '';
        this.view.best.container.insertAdjacentHTML('afterbegin', this.spinerView('get'));

        // --> update data control
        for (let key in this.data) {
            this.dataControl.filter[key] = this.data[key];
        }

        // @ drop infinity data
        this.dataControl.dropInfinity();

        // --> send request
        ajax('filtering/', this.dataControl, this.view.updateView, this.view);
    }
}

// @ Filter Sort
class FilterSort extends Control {
    constructor(kwargs) {
        super();

        this.dataControl = kwargs.control;
        this.viewControl = kwargs.view,
            
        this.key = kwargs.key;
        this.parent = this._getElement(kwargs.parent);
        this.container = this._getElement(kwargs.container, this.parent);

        this.simple = {
            container: this._getElement(kwargs.simpleSort)
        };
        this.simple.items = this._getElements('[data-io-simple-sort]', this.simple.container);

        this.advanced = {
            container: this._getElement(kwargs.modal, this.parent)
        };
        this.advanced.body = this._getElement('.modal-body', this.advanced.container);
        this.advanced.selected = this._getElement(kwargs.priorityList, this.advanced.body);
        this.advanced.unselected = this._getElement(kwargs.sortList, this.advanced.body);
        this.advanced.items = this._getElements('[data-io-advanced-sort]', this.advanced.body);
        this.advanced.angle = this._getChilds('.fa-angle-down', this.advanced.items);
        this.advanced.plus = this._getChilds('.fa-plus', this.advanced.items);
        this.advanced.handle = this._getChilds('.drag-handle', this.advanced.items);

        this.sort = [];

        this.url = kwargs.url;

        if (kwargs.debug == true) {this._debug();}
    }
    
    init() {

        this.dragElems = this.advanced.items.filter(item => { if (item.parentElement == this.advanced.selected) { return item; } });

        this.plusEvent();
        this.angleEvent();
        this.simpleEvent();
        this.drag();
    }

    // --> plus event
    plusEvent() {
        this.advanced.plus.map((plus, i) => {
            plus.addEventListener('click', () => {
                const element = this.advanced.items[i];
                
                if (element.parentElement == this.advanced.unselected) {
                    element.classList.add('active-2');
                    this.advanced.selected.insertAdjacentElement('afterbegin', element);
                    this.dragElems.unshift(element);
                }
                else if (element.parentElement == this.advanced.selected) {
                    element.classList.remove('active-1');
                    element.classList.remove('active-2');
                    this.advanced.unselected.insertAdjacentElement('afterbegin', element);
                    this.dragElems = this.dragElems.filter(elem => { if (elem != element) { return elem; } });
                }

                this.dragElems = this._getElements('.modal-sort-item', this.advanced.selected);
                
                this.dragEvent(this.dragElems);
                this.sortUpdate('advanced');
            });
        });
    }

    // --> angle event
    angleEvent() {
        this.advanced.angle.map((angle, i) => {
            angle.addEventListener('click', () => {

                const element = this.advanced.items[i];
                
                if (element.classList.contains('active-1')) {
                    element.classList.remove('active-1');
                    element.classList.add('active-2');
                }
                else if (element.classList.contains('active-2')) {
                    element.classList.remove('active-2');
                    element.classList.add('active-1');
                }

                
                this.sortUpdate('advanced');

            });
        });
    }

    // --> simple event
    simpleEvent() {
        this.simple.items.map(item => {
            item.addEventListener('click', () => {
                // @ clear active on simple items
                this.simple.items.map(cl => { if (cl !== item) {cl.classList.remove('active-1'); cl.classList.remove('active-2');} });
                
                if (item.classList.contains('active-1')) {
                    item.classList.remove('active-1');
                    item.classList.add('active-2');
                }
                else if (item.classList.contains('active-2')) {
                    item.classList.remove('active-2');
                    item.classList.add('active-1');
                }
                else if (!item.classList.contains('active-1') && !item.classList.contains('active-2')) {
                    item.classList.add('active-2');
                }

                // -- drag func
                this.updateDragElems();
                this.dragEvent(this.dragElems);
                
                // -- update sort
                this.sortUpdate('simple');
            });
        });
    }

    // --> update drag elems list
    updateDragElems() {
        this.advanced.items.map(item => {

            this.sort.forEach(value => {
                console.log(value);
                console.log(item.dataset.ioAdvancedSort);
            }); 
        });
        this.dragElems = this._getElements('[data-io-advanced-sort]', this.advanced.selected);

    }

    // --> drag ability
    drag() {
        this.dragObject = new Sortable(this.advanced.selected, {
            animation: 200,
            handle: '.drag-handle'
        });
    }

    // --> drag event
    dragEvent(elements) {
        elements.map(elem => {
            elem.ondragend = () => {
                this.sortUpdate('advanced'); 
            };
        });
    }

    // --> update data control
    sortUpdate(from) {
        // -- sort
        if (from == 'advanced') {
            this.sort = [];
            const selectedValue = [];
            // <-- get elements and data values
            this.dragElems = this._getElements('[data-io-advanced-sort]', this.advanced.selected);
            this.dragElems.map(elem => {

                let value = elem.dataset.ioAdvancedSort;
                selectedValue.push(value);

                if (elem.classList.contains('active-1')) { value = '-' + value; }
                this.sort.push(value);

            });

            // @ clear simple active
            this.simple.items.map(elem => {
                elem.classList.remove('active-1');
                elem.classList.remove('active-2');
            });

            // --> add active to simple item
            this.simple.items.map(elem => {
                if (elem.dataset.ioSimpleSort == [selectedValue[0]]) {

                    if (this.sort[0] == selectedValue[0]) {
                        elem.classList.add('active-1');
                    }
                    else {
                        elem.classList.add('active-2');
                    }

                }
            });

        }
        else if (from == 'simple') {
            this.simple.items.map(item => {
                if (item.classList.contains('active-1') || item.classList.contains('active-2')) {
                    let value = item.dataset.ioSimpleSort;
                    this.sort = this.sort.filter(v => {
                        if (v != value && v != `-${value}`) {
                            return v;
                        }
                    });
                    if (item.classList.contains('active-1')) {
                        value = '-' + value;
                    }
                    this.sort.unshift(value);
                }
            });  
        }

        // -- compare sort
        if (this.sort[0] == 'compare' || this.sort[0] == '-compare') {
            const compare = this.sort[0];

            this.dataControl.sort.compare[this.key] = compare;
            this.sort = this.sort.filter(v => { return v != compare; });
        }
        else {
            this.dataControl.sort.compare[this.key] = false;
        }
        
        // --> update data control sort
        this.dataControl.sort[this.key] = this.sort;

        // --> comparison selected sort
        if (this.key == 'comparison') {
            const selected = this.view.comparison.selected.map(v => { return v.replace('chb_', ''); });
            this.dataControl.comparisonSelected = selected;
        }

        // --> clean html + insert spiner
        this.container.innerHTML = '';
        this.container.insertAdjacentHTML('afterbegin', this.spinerView('get'));

        //  @ lock scroll
        this.dataControl.scrollLock = true;

        // @ drop infinity data
        this.dataControl.dropInfinity();
        // --> send ajax
        ajax(this.url, this.dataControl, this.updateView, this);

    }

    // <-- emergence of view elements
    updateViewEnd(responce) {

        // <-- get max order
        const resultLen = responce.resultResponceLen;
        const bestLen = responce.bestResponceLen;

        // --> add abilitys
        this.viewControl.updateHTMLList(this.key);
        this.viewControl.selected();
        this.viewControl.selecteble();

        // -- update max order len
        this.dataControl.maxOrder.result = resultLen;
        this.dataControl.maxOrder.best = bestLen;

        //  @ unlock scroll
        this.dataControl.scrollLock = false;
    }
}

// @ Comparison
class Comparison extends Control {
    constructor(kwargs) {
        super();
        this.compKey = 'comparing';

        this.dataControl = kwargs.dataControl;

        // --> result
        this.result = {
            container: this._getElement(kwargs.resultContainer),
            len: this._getElement('#result-length')
        };
        this.result.card = this._getElements('.result__item', this.result.container);
        this.result.labels = this._getChilds('[data-io-label]', this.result.card);
        this.result.inputs = this._getChilds('input[type="checkbox"]', this.result.labels);
        
        // --> best 
        this.best = {
            container: this._getElement(kwargs.bestContainer),
            len: this._getElement('#best-length')
        }
        this.best.card = this._getElements('.result__item', this.best.container);
        this.best.labels = this._getChilds('[data-io-label]', this.best.card);
        this.best.inputs = this._getChilds('input[type="checkbox"]', this.best.labels);

        // --> comparison 
        this.comparison = {
            container: this._getElement(kwargs.comparisonContainer),
            lenList: this._getElementsList(kwargs.comparisonLen),
            deleteButton: this._getElement('#comparison-delet-selected'),
            deleteAllButton: this._getElement('#comparison-delet-all'),
            shareLink: this._getElement('#share-link'),
            selected: [],
        }

        // --> share
        this.share = {
            container: this._getElement('#share-link-container'),
            link: this._getElement('#messageBox'),
            trigger: this._getElement('#share-link-button'),
            radio: this._getElements('input[name="shareprice"]'),
            type: this._getElement('#share-type-text') 
        };

        // --> cart pach
        this.cart = {
            container: this._getElement(kwargs.cartPack),
            button: this._getElement(kwargs.cartButton),

            responceTitle: {
                success: 'The stones have been placed in the cart',
                error: 'You haven\'t chosen a single stone',
                alert: 'Have you already added these stones'
            }
        };
        this.cart.length = this._getElement(kwargs.cartLength, this.cart.container);
        this.cart.exit = this._getElement(kwargs.cartExit, this.cart.container);
        this.cart.title = this._getElement(kwargs.cartTitle, this.cart.container);
    }

    // -- init methods
    init() {
        // -- create comp storage
        if (localStorage.getItem(this.compKey) == null || localStorage.getItem(this.compKey) == undefined) {
            localStorage.setItem(this.compKey, JSON.stringify([]));
        }

        this.comparing = JSON.parse(localStorage.getItem(this.compKey));
        
        // --> set selecteble result and best
        this.selecteble();

        // --> set selected for inputs
        this.selected();

        // -- comparison delete selected
        this.comparisonDelete();
        
        // -- comparison delete all
        this.comparisonDeleteAll();

        // -- comparison share
        this.shareLink();

        // -- card acrodion
        this.upgrade(this.result.card);
        this.upgrade(this.best.card);

        // --> cart pack
        this.cartPack();
    }

    // -- set selecteble
    selecteble() {

        // --> result selecteble
        const resultLabelEvent = new ElementsControl({
            manager: this.result.labels,
            managed: this.result.inputs
        }).label(
            // -- checked 
            (value) => {
                const storage = JSON.parse(localStorage.getItem(this.compKey));
                storage.push(value);
                this.comparing = [...new Set(storage)];
                localStorage.setItem(this.compKey, JSON.stringify(this.comparing));
                this.selected();
            },
            
            // -- unchecked 
            (value) => {
                const storage = JSON.parse(localStorage.getItem(this.compKey));
                this.comparing = storage.filter(v => { return v != value });
                localStorage.setItem(this.compKey, JSON.stringify(this.comparing));
                this.selected();
            }
        );
        
        // --> best selecteble
        const bestLabelEvent = new ElementsControl({
            manager: this.best.labels,
            managed: this.best.inputs
        }).label(
            // -- checked 
            (value) => {
                const storage = JSON.parse(localStorage.getItem(this.compKey));
                storage.push(value);
                this.comparing = [...new Set(storage)];
                localStorage.setItem(this.compKey, JSON.stringify(this.comparing));
                this.selected();
            },
            
            // -- unchecked 
            (value) => {
                const storage = JSON.parse(localStorage.getItem(this.compKey));
                this.comparing = storage.filter(v => { return v != value });
                localStorage.setItem(this.compKey, JSON.stringify(this.comparing));
                this.selected();
            }
        );
    }

    // -- set selected
    selected() {
        
        const inputs = [...this.result.inputs, ...this.best.inputs];

        // -- set inputs checked false
        inputs.map(input => {
            input.checked = false;
            input.parentElement.classList.remove('active');
        });

        // --> set checked for selected inputs
        inputs.map(input => {
            this.comparing.map(value => {
                if (input.name == value) {
                    input.checked = true;
                    input.parentElement.classList.add('active');
                }
            });
        });

        // --> set len for len views
        this.comparison.lenList.map(item => { item.textContent = `(${this.comparing.length})` });

        // --> update data control
        this.dataControl.comparing = this.comparing.map(value => { return value.replace('chb_', ''); });

        // --> send request for filtering key
        ajax('filtering/of/key/', this.dataControl, this.comparisonView, this);
    }

    // -- update HTML List
    updateHTMLList(key) {
        if (key == 'comparison') {
            this.comparison.card = this._getElements('.result__item', this.comparison.container);
            this.comparison.labels = this._getChilds('[data-io-label]', this.comparison.card);
            this.comparison.inputs = this._getChilds('input[type="checkbox"]', this.comparison.labels);
            this.upgrade(this.comparison.card);
        }
        else if (key == 'result') {
            this.result.card = this._getElements('.result__item', this.result.container);
            this.result.labels = this._getChilds('[data-io-label]', this.result.card);
            this.result.inputs = this._getChilds('input[type="checkbox"]', this.result.labels);
            this.upgrade(this.result.card);
        }
        else if (key == 'best') {
            this.best.card = this._getElements('.result__item', this.best.container);
            this.best.labels = this._getChilds('[data-io-label]', this.best.card);
            this.best.inputs = this._getChilds('input[type="checkbox"]', this.best.labels);
            this.upgrade(this.best.card);
        }
    }

    // -- comparison view
    comparisonView(diamonds, context) {
        const emptyComp = context.getEmpty('Comparison list is empty');
        if (diamonds.length != 0) {
            context.comparison.container.innerHTML = '';
            diamonds.map(diamond => {
                context.comparison.container.insertAdjacentHTML('beforeend', context.getDiamondHTML(diamond));
            });
            context.updateHTMLList('comparison');
            context.comparisonSelected();
            context.comparisonSelecteble();
        }
        else {
            const empty = context._getElement('#empty-allert', context.comparison.container);
            if (empty == undefined || empty == null) {
                context.comparison.innerHTML = '';
                context.comparison.container.insertAdjacentHTML('afterbegin', emptyComp);
            }
        }
    }

    // -- comparison selecteble
    comparisonSelecteble() {

        // --> comparison selecteble
        const comparisonLabelEvent = new ElementsControl({
            manager: this.comparison.labels,
            managed: this.comparison.inputs
        }).label(
            // -- checked 
            (value) => {
                this.comparison.selected.push(value);
                this.comparison.inputs.map(input => {
                    if (input.name == value) {
                        input.checked == true;
                        input.parentElement.classList.add('active');
                    }
                });
            },
            
            // -- unchecked 
            (value) => {
                this.comparison.selected = this.comparison.selected.filter(v => { return v != value; });
                this.comparison.inputs.map(input => {
                    if (input.name == value) {
                        input.checked == false;
                        input.parentElement.classList.remove('active');
                    }
                });
            }
        );
    }

    // -- comparison selected
    comparisonSelected() {
        const inputs = this.comparison.inputs;

        // -- set inputs checked false
        inputs.map(input => {
            input.checked = false;
            input.parentElement.classList.remove('active');
        });

        // --> set checked for selected inputs
        inputs.map(input => {
            this.comparison.selected.map(value => {
                if (input.name == value) {
                    input.checked = true;
                    input.parentElement.classList.add('active');
                }
            });
        });
    }

    // -- comparison delete selected
    comparisonDelete() {
        this.comparison.deleteButton.addEventListener('click', () => {
            if (this.comparison.selected.length != 0) {
                this.comparison.selected.map(value => {
                    this.comparison.inputs.map((input, index) => {
                        if (input.name == value) {
                            this.comparison.selected = this.comparison.selected.filter(v => { return v != value; });
                            this.comparing = this.comparing.filter(v => { return v != value; });
                            localStorage.setItem(this.compKey, JSON.stringify(this.comparing));
                            this.comparison.card[index].remove();
                        }
                    });
                });
                this.updateHTMLList('comparison');
                this.selected();
            }
        });
    }

    // -- comparison delete all
    comparisonDeleteAll() {
        this.comparison.deleteAllButton.addEventListener('click', () => {
            this.comparison.selected = [];
            localStorage.setItem(this.compKey, JSON.stringify([]));
            this.comparing = [];
            this.comparison.card.map(item => { item.remove(); });
            this.updateHTMLList('comparison');
            this.selected();
        });
    }

    // -- share link
    shareLink() {

        this.share.trigger.addEventListener('click', () => {
            this.share.data = {
                share: '0',
                comparing: this.dataControl.comparing
            };

            if (this.share.data.comparing.length > 0) {
                // <-- get radio value 
                this.share.radio.map(inp => {
                });

                // --> send ajax
                ajax('/share/create/', this.share.data, (responce, context) => {

                    // -- update link view
                    context.share.container.classList.add('active');
                    context.share.link.textContent = responce.share_link;

                    // -- show share type
                    if (context.share.data.share == '0') {
                        context.share.type.innerHTML = 'Your link to the list of products <span class="text-success">without price</span> <br> was created and copied';
                    }
                    else if (context.share.data.share == '1') {
                        context.share.type.innerHTML = 'Your link to the list of products <span class="text-success">with price</span> <br> was created and copied';
                    }

                    // @ copied to clipboard
                    const data = [new ClipboardItem({ "text/plain": new Blob([responce.share_link], { type: "text/plain" }) })];
                    navigator.clipboard.write(data).then(function() {
                    }, function() {
                        console.error("Unable to write to clipboard. :-(");
                    });

                }, this);
            }
            else {
                this.share.container.classList.add('active');
                this.share.type.innerHTML = 'First select the products you want to share';
                this.share.link.innerHTML = '--';
            }
        });
        
    }

    // -- card acordion
    upgrade(cards) {

        const drop1 = new ElementsControl({
            manager: this._getChilds('.result__item-list', cards),
            managed: this._getChilds('.result__drop-down', cards)
        });

        const drop2 = new ElementsControl({
            manager: this._getChilds('.acordion__btn', cards),
            managed: this._getChilds('.acordion__body', cards)
        });

        drop1.toggler({
            notThis: this._getChilds('[data-io-label]', cards)
        });
        drop2.toggler();

    }

    // -- update view
    updateView(responce, context) {

        const resultDiamonds = JSON.parse(responce.result),
            bestDiamonds = JSON.parse(responce.best),
            resultLen = responce.resultResponceLen,
            bestLen = responce.bestResponceLen;
        
        if (resultDiamonds.length !== 0) {
            setTimeout(() => {
                // --> remove spiner
                context.spinerView('remove', context.result.container);
    
                // --> set new result / best len
                context.result.len.textContent = `(${resultLen})`
                
                // --> add new diamonds
                resultDiamonds.map(diamond => {
                    context.result.container.insertAdjacentHTML('beforeend', context.getDiamondHTML(diamond));
                });

                // --> update and upgrade diamond items
                context.updateHTMLList('result');
    
                // --> set selecteble and selected for new diamonds
                context.selecteble();
                context.selected();
            }, 200);
        }
        else {
            context.result.len.textContent = `(${resultLen})`
            context.result.container.innerHTML = '';
            context.result.container.insertAdjacentHTML('beforeend', context.getEmpty('Nothing was found for your query'));
        }

        if (bestDiamonds.length !== 0) {
            setTimeout(() => {
                // --> remove spiner
                context.spinerView('remove', context.best.container);
    
                // --> set new result / best len
                context.best.len.textContent = `(${bestLen})`
                
                // --> add new diamonds
                bestDiamonds.map(diamond => {
                    context.best.container.insertAdjacentHTML('beforeend', context.getDiamondHTML(diamond));
                });
    
                // --> update and upgrade diamond items
                context.updateHTMLList('best');
    
            }, 200);
        } 
        else {
            context.best.len.textContent = `(${bestLen})`
            context.best.container.innerHTML = '';
            context.best.container.insertAdjacentHTML('beforeend', context.getEmpty('Nothing was found for your query'));
        } 

        // --> set seleteble for diamonds cards
        if (resultLen !== 0 || bestLen !== 0) {
            setTimeout(() => {
                context.selecteble();
                context.selected();

                // @ open scroll lock
                context.dataControl.scrollLock = false;

                // -- update max order len
                context.dataControl.maxOrder.result = resultLen;
                context.dataControl.maxOrder.best = bestLen;
                
            }, 210);
        }
    }

    // -- comparison add to cart
    cartPack() {
        this.cart.exit.addEventListener('click', () => {
            this.cart.container.classList.remove('active');
            this.cart.title.classList.remove('text-danger');
            this.cart.title.classList.remove('text-succes');
            this.cart.title.classList.remove('text-alert');
        });

        this.cart.button.addEventListener('click', () => {
            this.cart.container.classList.add('active');

            if (this.comparing.length != 0) {
                const forRequest = this.comparing.map(item => { return item.replace('chb_', ''); });
                ajax('/cart/pack/', forRequest, this.cartResponce, this);
            }
            else {
                this.cart.title.textContent = this.cart.responceTitle.error

                this.cart.title.classList.remove('text-succes');
                this.cart.title.classList.remove('text-alert');

                this.cart.title.classList.add('text-danger');
            }
            
        });
    }

    // -- cart pack responce
    cartResponce(responce, context) {

        // -- update cart length in cart pack
        context.cart.length.textContent = responce.update_len;

        if (responce.update_len == 0) {
            context.cart.title.textContent = context.cart.responceTitle.alert
            context.cart.title.classList.remove('text-danger');
            context.cart.title.classList.remove('text-success');
            
            context.cart.title.classList.add('text-alert');

        }
        else {
            context.cart.title.textContent = context.cart.responceTitle.success;
            context.cart.title.classList.remove('text-danger');
            context.cart.title.classList.remove('text-alert');

            context.cart.title.classList.add('text-success');
        }

        // -- clean comparison list
        context.comparison.selected = [];
        localStorage.setItem(context.compKey, JSON.stringify([]));
        context.comparing = [];
        context.comparison.card.map(item => { item.remove(); });
        context.updateHTMLList('comparison');
        context.selected();
    
    }

}

// @ infinity Scroll
class InfinityScroll extends Control {
    constructor(kwargs) {
        super();

        this.step = 15;
        this.stop = false

        this.key = kwargs.key;
        this.dataControl = kwargs.dataControl;
        this.viewControl = kwargs.viewControl;
        this.container = this._getElement(kwargs.container);

        if (kwargs.debug == true) { this._debug(); }

    }

    // @ permission
    permission(direction) {
        this.direction = direction;
        let verdict = false;
        
        // <-- get start/end of ordering
        const start = this.dataControl.ordering[this.key][0];
        const end = this.dataControl.ordering[this.key][1];

        // -- check permission
        if (!this.dataControl.scrollLock) {
            
            // @ lock scroll
            this.dataControl.scrollLock = true;

            if (this.direction == 'next' && this.dataControl.permissions[this.key].next === true) {
                if (this.dataControl.maxOrder[this.key] == null || this.dataControl.maxOrder[this.key] > end) {
                    verdict = true;
                }
            }
            else if (this.direction == 'prev' && this.dataControl.permissions[this.key].prev === true) {
                if (start > 0) {
                    verdict = true;
                }
                else {
                    this.dataControl.permissions[this.key].prev = false;
                }
            }
            else {
                verdict = false;
            }

            // -- check verdict + remove lock of scroll
            if (verdict == false) {
                // @ lock scroll
                this.dataControl.scrollLock = false;
            }
        }

        // <-- return verdict
        return verdict;
    }

    // --> cursor next
    next() {
        if (this.permission('next') && !this.stop) {

            this.stop = true

            // <-- get ordering values
            const start = this.dataControl.ordering[this.key][0];
            const end = this.dataControl.ordering[this.key][1];
            
            const maxOrder = this.dataControl.maxOrder[this.key];

            // -- update request order
            if (maxOrder != null && end + this.step > maxOrder) {
                this.step = (end + this.step) - maxOrder;
                this.dataControl.permissions[this.key].next = false;
            }
            else if (maxOrder != null && end + this.step == maxOrder) {
                this.dataControl.permissions[this.key].next = false;
            }
            this.dataControl.requestOrdering[this.key] = [end, end + this.step];
            this.dataControl.ordering[this.key] = [start + this.step, end + this.step];

            // --> make permission next true
            this.dataControl.permissions[this.key].prev = true;

            // --> request preparing
            this.preparing();
        }
    }
    
    // --> cursor prev
    prev() {
        if (this.permission('prev')) {
            this.step = 15;

            // <-- get ordering values
            const start = this.dataControl.ordering[this.key][0];
            const end = this.dataControl.ordering[this.key][1];

            // -- update request order
            if (start - this.step < 0) {
                const num = (start - this.step) * -1;
                this.step = this.step - num;
                this.dataControl.permissions[this.key].prev = false;
            }
            else if (start - this.step == 0) {
                this.dataControl.permissions[this.key].prev = false;
            }
            this.dataControl.requestOrdering[this.key] = [start - this.step, start];
            this.dataControl.ordering[this.key] = [start - this.step, end - this.step];
            
            // -- open next

            this.dataControl.permissions[this.key].next = true;
            // --> request preparing
            this.preparing();
            
        }
    }

    // --> update view
    preparing() {

        // -- create insert position
        if (this.direction == 'next') {
            this.insertPosition = 'beforeend';
        }
        else if (this.direction == 'prev') {
            this.insertPosition = 'afterbegin';
        }

        // -- insert spiner and scroll to
        if (this.direction == 'next') {
            this.container.insertAdjacentHTML(this.insertPosition, this.spinerView('get'));

            let last = this._getElements('.result__item', this.container) 
            last = last[last.length - 1]

            last.scrollIntoView({
                block: 'end',
            });
        }
        else if (this.direction == 'prev') {
            this.container.insertAdjacentHTML(this.insertPosition, this.spinerView('get'));
            
            let first = this._getElements('.result__item', this.container) 
            first = first[0]

            first.scrollIntoView({
                block: 'start',
            });

        }
        
        // --> make request
        this.request();
    }

    // --> request
    request() {
        if (this.direction == 'prev') {
            this.responceReverse = true;
        }
        ajax('filtering/', this.dataControl, this.updateView, this);
    }

    // <-- end update view
    updateViewEnd(responce) {
        
        const diamonds = JSON.parse(responce[this.key]);
        if (diamonds.length == 0) {
            if (this.direction == 'next') { this.dataControl.permissions[this.key].next = false; }
            else if (this.direction == 'prev') { this.dataControl.permissions[this.key].prev = false; }
        }

        // -- update max order
        this.dataControl.maxOrder[this.key] = responce[`${this.key}ResponceLen`];
        this.step = JSON.parse(responce[this.key]).length;

        // <-- get elements
        this.elements = this._getElements('.result__item', this.container);
        
        if (this.direction == 'next') {

            // @ remove element from DOM
            this.elements.map((elem, i) => {
                if (i < this.step) { elem.remove(); }
            });

            // @ remove element from element list
            this.elements = this.elements.filter((elem, i) => { if (i >= this.step) { return elem; } });

            // --> add abilitys
            this.viewControl.updateHTMLList(this.key);
            this.viewControl.selecteble();
            this.viewControl.selected();

            // @ open scroll lock
            this.dataControl.scrollLock = false;
        }
        else if (this.direction == 'prev') {
            
            // @ remove element from DOM
            this.elements.map((elem, i) => {
                if (i >= this.elements.length - this.step) { elem.remove(); }
            });

            // @ remove element from element list
            this.elements = this.elements.filter((elem, i) => { if (i < this.elements.length - this.step) { return elem; } });

            // --> add abilitys
            this.viewControl.updateHTMLList(this.key);
            this.viewControl.selecteble();
            this.viewControl.selected();

            // @ open scroll lock
            this.dataControl.scrollLock = false;
            this.responceReverse = false;
        }
        // -- default this step
        this.step = 15;
        this.stop = false
    }
}

// @ DOM Content Loaded;
document.addEventListener("DOMContentLoaded", () => {

    // -- Data Control -- //
    const dataControl = new DataControl({});

    // -- Comparison -- //
    const comparison = new Comparison({
        dataControl: dataControl,
        resultContainer: '#result__items',
        bestContainer: '#best__items',
        comparisonContainer: '#comparison__items',
        comparisonLen: ['#comparison-lenth', '#add-to-cart-lenght'],
        cartPack: '#cart-pack',
        cartButton: '#add-to-cart-selected-diamonds',
        cartLength: '#cart-pack-length',
        cartExit: '#cart-pack-exit',
        cartTitle: '#cart-pack-title'
    });
    comparison.init();

    // -- Filter NoUI -- //
    function filterNoUI() {
        // -- create NoUI Constructor
        const noUIKwargs = {
            parent: '.diamonds-filter-container',
            numericSliders: '[data-slider-type="numeric"]',
            stringSliders: '[data-slider-type="string"]',
            shapeInputs: '[data-slider-type="shape"]',
            labInputs: '[data-slider-type="lab"]',
            cleanButton: '#reset-filter',
            dataControl: dataControl,
            view: comparison,
            url: 'filtering/',
        }
        const noUI = new NoUI(noUIKwargs);
        
        // -- create sale price
        const price_values = noUI.getMaxMin('#range_price');
        const priceNoUI = noUI.numeric('[data-slider="price"]', {
            params: {
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
            options: {
                key: 'sale_price'
            }
        });
        
        // -- create carat
        const carat_values = noUI.getMaxMin('#range_carat');
        const caratNoUI = noUI.numeric('[data-slider="carat"]', {
            params: {
                start: [carat_values.min, carat_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: carat_values.min,
                    max: carat_values.max,
                },
            },
            options: {
                key: 'weight'
            },
        });
        
        // -- create lw
        const lw_values = noUI.getMaxMin('#range_lw');
        const lwNoUI = noUI.numeric('[data-slider="lw"]', {
            params: {
                start: [lw_values.min, lw_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: lw_values.min,
                    max: lw_values.max,
                },
            },
            options: {
                key: 'lw'
            }
        });
        
        // -- create table
        const table_values = noUI.getMaxMin('#range_table');
        const tableNoUI = noUI.numeric('[data-slider="table"]', {
            params: {
                start: [table_values.min, table_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: table_values.min,
                    max: table_values.max,
                },
            },
            options: {
                key: 'table_procent'
            }
        });
        
        // -- create length
        const length_values = noUI.getMaxMin('#range_length');
        const lengthNoUI = noUI.numeric('[data-slider="length"]', {
            params: {
                start: [length_values.min, length_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: length_values.min,
                    max: length_values.max,
                },
            },
            options: {
                key: 'length_mm'
            }

        });
        
        // -- create depth
        const dapth_values = noUI.getMaxMin('#range_depth');
        const dapthNoUI = noUI.numeric('[data-slider="depth"]', {
            params: {
                start: [dapth_values.min, dapth_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: dapth_values.min,
                    max: dapth_values.max,
                },
            },
            options: {
                key: 'depth'
            }
        });

        // -- create depth procent
        const depth_procent__values = noUI.getMaxMin('#range_depth_procent');
        const dapth_procent_NoUI = noUI.numeric('[data-slider="depth_procent"]', {
            params: {
                start: [depth_procent__values.min, depth_procent__values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: depth_procent__values.min,
                    max: depth_procent__values.max,
                },
            },
            options: {
                key: 'depth_procent'
            }
        });
        
        // -- create width
        const width_values = noUI.getMaxMin('#range_width');
        const widthNoUI = noUI.numeric('[data-slider="width"]', {
            params: {
                start: [width_values.min, width_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: width_values.min,
                    max: width_values.max,
                },
            },
            options: {
                key: 'width'
            }
        });

        // -- cut create
        const cutNoUI = noUI.string('[data-slider="cut"]', {
            params: {
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
                replacePips: ["Fair", "Good", "Very Good", "Ideal", "Super Ideal"]
            },
            options: {
                key: 'cut'
            },
        });

        // -- color create
        const colorNoUI = noUI.string('[data-slider="color"]', {
            params: {
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
                replacePips: ["M", "L", "K", "J", "I", "H", "G", "F", "E", "D"],
            },
            options: {
                key: 'color'
            },
        });

        // -- clarity create
        const clarityNoUI = noUI.string('[data-slider="clarity"]', {
            params: {
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
                replacePips: ["I2", "I1", "SI2", "SI1", "VS2", "VS1", "VVS2", "VVS1", "IF", "FI",],
            },
            options: {
                key: 'clarity'
            },
        });

        // -- clarity create
        const polishNoUI = noUI.string('[data-slider="polish"]', {
            params: {
                start: [1, 3],
                connect: true,
                step: 1,
                range: {
                    min: 1,
                    max: 3,
                },
                pips: {
                    mode: "count",
                    values: 3,
                    density: 1,
                },
                replacePips: ["Good", "Very Good", "Excellent"],
            },
            options: {
                key: 'polish'
            },
        });

        // -- symmetry create
        const symmetryNoUI = noUI.string('[data-slider="symmetry"]', {
            params: {
                start: [1, 3],
                connect: true,
                step: 1,
                range: {
                    min: 1,
                    max: 3,
                },
                pips: {
                    mode: "count",
                    values: 3,
                    density: 1,
                },
                replacePips: ["Good", "Very Good", "Excellent"],
            },
            options: {
                key: 'symmetry'
            },
        });

        // -- fluour create
        const fluourNoUI = noUI.string('[data-slider="fluour"]', {
            params: {
                start: [1, 5],
                connect: true,
                step: 1,
                range: {
                    min: 1,
                    max: 5,
                },
                pips: {
                    mode: "count",
                    values: 5,
                    density: 1,
                },
                replacePips: ["None", "Faint", "Medium", "Strong", "Very Strong"],
            },
            options: {
                key: 'fluor'
            },
        });

        // -- selectebel inputs create
        const shapeNoUI = noUI.select('shape');
        const labNoUI = noUI.select('lab');
    } filterNoUI();

    // -- Filter Dynamic -- //
    function filterDynamic() {
        const filterMore = new ElementsControl({
            manager: '#filter-more-btn',
            managed: '#filter-2'
        });
        filterMore.toggler();
    
        const filterMoreMob = new ElementsControl({
            manager: '#filters-container-toggler',
            managed: '#filters-container'
        });
        filterMoreMob.screen(() => {
            filterMoreMob.toggler();
        });
    
        const filterMoreMobEX = new ElementsControl({
            manager: '#filter-exit-btn',
            managed: '#filters-container'
        });
        filterMoreMobEX.screen(() => {
            filterMoreMobEX.toggler();
        });
    
        const shapeJump = new ElementsControl({
            manager: '#filter-shape',
            managed: '#shape-jump-container'
        });
        shapeJump.screen(() => {
            shapeJump.jump('beforeend');
        });
    
        const filterMobItems = new ElementsControl({
            manager: '.filter-info',
            managed: '.filter-item'
        });
        filterMobItems.screen(() => {
            filterMobItems.toggler();
        });
    
        const filterMobSwitche = new ElementsControl({
            manager: '#filter-advenced-btn',
            managed: '[data-filter-switch]'
        });
        filterMobSwitche.screen(() => {
            filterMobSwitche.switcher();
        });

        // --> share
        const shareModal = new ElementsControl({
            manager: '#share-link',
            managed: '#share-link-modal',
        });
        shareModal.toggler();

        const shareModalClose = new ElementsControl({
            manager: '#share-modal-close',
            managed: '#share-link-modal',
        });
        shareModalClose.toggler()


    } filterDynamic();

    // filter diamond items scroll fix
    function scrollEvents() {

        const resultInfinity = new InfinityScroll({
            key: 'result',
            container: '#result__items',
            dataControl: dataControl,
            viewControl: comparison,
        });

        const bestInfinity = new InfinityScroll({
            key: 'best',
            container: '#best__items',
            dataControl: dataControl,
            viewControl: comparison,
        });

        // * -------------------------- resutlScroll
        const resutlScroll = new ScrollFix({
            container: '#result__items',
            extensionBottom: () => {
                resultInfinity.next();
            },
            extensionTop: () => {
                resultInfinity.prev();
            }
        });
        
        // * -------------------------- bestlScroll
        const bestlScroll = new ScrollFix({
            container: '#best__items',
            extensionBottom: () => {
                bestInfinity.next();
            },
            extensionTop: () => {
                bestInfinity.prev();
            }
        });
        
        // * -------------------------- comparisonlScroll
        const comparisonlScroll = new ScrollFix({
            container: '#comparison__items'
        });
    
    } scrollEvents();

    // * --------------------------------------------------------- Sort
    // -- sort result -- //
    const sortResult = new FilterSort({
        parent: '#pills-result',
        container: '#result__items',
        key: 'result',
        control: dataControl,
        view: comparison,
        
        simpleSort: '#result-simple-sort',
        modal: '#result-name--modal',
        priorityList: '#result-name-priority',
        sortList: '#result-name-sort',
        url: 'filtering/',

    }).init();

    const sortBest = new FilterSort({
        parent: '#pills-best',
        container: '#best__items',
        key: 'best',
        control: dataControl,
        view: comparison,
        
        simpleSort: '#best-simple-sort',
        modal: '#best-name--modal',
        priorityList: '#best-name-priority',
        sortList: '#best-name-sort',
        url: 'filtering/',

    }).init();

    const sortComparison = new FilterSort({
        parent: '#pills-comparison',
        container: '#comparison__items',
        key: 'comparison',
        control: dataControl,
        view: comparison,
        
        simpleSort: '#comparison-simple-sort',
        modal: '#comparison-name--modal',
        priorityList: '#comparison-name-priority',
        sortList: '#comparison-name-sort',
        url: 'filtering/of/key/',

    }).init();


});