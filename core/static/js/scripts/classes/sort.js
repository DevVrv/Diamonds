'use strict';

class SortSystem {
    constructor(kwargs) {
        // * element view container
        this.viewContainer = this.getElement(kwargs.viewContainer);

        // * simple sort items
        this.simpleContainer = this.getElement(kwargs.simpleContainer);
        this.simpleItems = this.getElements(kwargs.simpleItems, this.simpleContainer);
        
        // * advanced sort items
        this.advancedContainer = this.getElement(kwargs.advancedContainer);
        this.advancedDragBox = this.getElement(kwargs.advancedDragBox, this.advancedContainer);
        this.advancedOffBox = this.getElement(kwargs.advancedOffBox, this.advancedContainer);
        this.advancedItems = this.getElements(kwargs.advancedItems, this.advancedContainer);

        // * advanced extencions
        this.plusItems = this.getChilds(kwargs.plusItems, this.advancedItems);
        this.angleItems = this.getChilds(kwargs.angleItems, this.advancedItems);

        // * orderBy values
        this.orderBy = ['sale_price'];

        // * url for reqest/responce
        this.url = kwargs.url;

        // * data names
        this.advancedDataName = kwargs.advancedDataName;
        this.simpleDataName = kwargs.simpleDataName;

        // * clarity list values
        this.clarityList = ['I3', 'I2', 'I1', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FI'];

        // * cut list values
        this.cutList = ['N/A', 'Fair', 'Good', 'Very Good', 'Ideal', 'Super Ideal', 'Excellent'];

        // * color list values
        this.colorList = ['M','L','K','J','I','H','G','F','E','D'];
        
        // * shape list values
        this.shapeList = ['Round', 'Marquise', 'Asscher', 'Cushion', 'Emerald', 'Heart', 'Oval', 'Pear', 'Princess', 'Radiant', 'Another'];
        
        // * symmetry list values
        this.symmetryList = ['N/A','Good','Very Good','Excellent'];
        
        // * polish list values
        this.polishList = ['N/A', 'Good', 'Very Good', 'Excellent'];
        
        // * fluour list values
        this.fluourList = ['None', 'Faint', 'Medium', 'Strong', 'Very Strong'];
        
        // * lab list values
        this.labList = ['IGI', 'GIA', 'GCAl', 'HDR']; 

        // @ extention
        this.extention = kwargs.extention;
        
    }

    // @ init method
    init() {
        // --> simple sort
        this.simpleSort();

        // --> advanced sort
        this.advancedSort();

        // --> drag event
        this.drag();

        // * drag listener
        this.dragEvent();

        // <-- return this
        return this;
    }
    
    // @ debug method
    debug(info = this) {
        console.log(info);
        return this;
    }

    // <-- get element from DOM
    getElement(selector, parent = document) {
        return parent.querySelector(selector);
    }

    // <-- get elements from DOM
    getElements(selector, parent = document) {
        return [...parent.querySelectorAll(selector)];
    }

    // <-- get childs element 
    getChilds(selector, parents) {
        const nodes = [];
        parents.map(parent => {
            nodes.push(parent.querySelector(selector));
        });
        return nodes;
    }

    // @ update values
    updateValues(value, type = 'default') {
        if (type == 'default') {
            this.orderBy = this.orderBy.filter(order => { if (order !== value && order !== `-${value}`) { return order; } });
            this.orderBy.unshift(value);
        }
        else if (type == 'reverse') {
            this.orderBy = this.orderBy.filter(order => { if (order !== value && order !== `-${value}`) { return order; } });
            this.orderBy.unshift(`-${value}`);
        }
        else if (type == 'remove') {
            this.orderBy = this.orderBy.filter(order => { if (order !== value && order !== `-${value}`) { return order; } });
        }
        else if (type == 'update') {

            if (this.orderBy.indexOf(value) == -1) {
                const index = this.orderBy.indexOf(`-${value}`);
                this.orderBy[index] = value;
            }
            else if (this.orderBy.indexOf(value) != -1) {
                const index = this.orderBy.indexOf(value);
                this.orderBy[index] = `-${value}`;
            }

        }
        else if (type == 'drag') {
            this.orderBy = this.orderBy.filter(order => { if (order !== value && order !== `-${value}`) { return order; } });
        }
        this.simpleUpdate();
        this.advancedUpdate();
        this.request();
    }

    // ? clean simple
    cleanSimple() {
        this.simpleItems.map(item => {
            item.classList.remove('active-1');
            item.classList.remove('active-2');
        });
    }

    // ? sort simple
    simpleSort() {
        this.simpleItems.map(item => {
            item.onclick = () => {
                if (item.classList.contains('active-1') || !item.classList.contains('active-1') && !item.classList.contains('active-2')) {
                    
                    // clean active
                    this.cleanSimple();
                    // add active
                    item.classList.add('active-2');
                    // get value from item
                    const value = item.dataset.ioSimpleSort;
                    
                    // * update order values
                    this.updateValues(value, 'default');

                }
                else if (item.classList.contains('active-2')) {
                    
                    // clean active
                    this.cleanSimple();
                    // add active
                    item.classList.add('active-1');
                    // get value from item
                    const value = item.dataset.ioSimpleSort;

                    // * update order values
                    this.updateValues(value, 'reverse');

                }
            }
        });
    }

    // ? simple update
    simpleUpdate() {
        this.cleanSimple();
        this.simpleItems.map(item => {
            // @ clean simple

            // * update simple active
            const value = item.dataset.ioSimpleSort;
            
            if (value == this.orderBy[0]) {
                item.classList.add('active-2');
            }
            else if (`-${value}` == this.orderBy[0]) {
                item.classList.add('active-1');
            }
        });
    }

    // * adnvaced plus 
    advancedPlus() {
        this.plusItems.map((item, index) => {
            item.onclick = () => {
                // ! on
                if (!this.advancedItems[index].classList.contains('active-1') && !this.advancedItems[index].classList.contains('active-2')) {
                    // * update class list
                    this.advancedItems[index].classList.add('active-2');
                    // * jump element
                    this.advancedDragBox.insertAdjacentElement('afterbegin', this.advancedItems[index]);

                    // <-- get value
                    const value = this.advancedItems[index].dataset.ioAdvancedSort;

                    // --> update order values
                    this.updateValues(value, 'default');
                    
                }
                // ! off
                else {
                    // * update class list
                    this.advancedItems[index].classList.remove('active-1');
                    this.advancedItems[index].classList.remove('active-2');
                    // * jump element
                    this.advancedOffBox.insertAdjacentElement('afterbegin', this.advancedItems[index]);
                    
                    // <-- get value
                    const value = this.advancedItems[index].dataset.ioAdvancedSort;
                    
                    // --> update order values
                    this.updateValues(value, 'remove');
                }
            }
        });
    }

    // * advanced angle
    advancedAngle() {
        this.angleItems.map((angle, index) => {
            angle.onclick = () => {
                if (this.advancedItems[index].classList.contains('active-1')) {
                    // * update class list
                    this.advancedItems[index].classList.remove('active-1')
                    this.advancedItems[index].classList.add('active-2')

                    // * update order values
                    const value = this.advancedItems[index].dataset.ioAdvancedSort;
                    this.updateValues(value, 'update');
                }
                else if (this.advancedItems[index].classList.contains('active-2')) {
                    // * update class list
                    this.advancedItems[index].classList.remove('active-2')
                    this.advancedItems[index].classList.add('active-1')

                    // * update order values
                    const value = this.advancedItems[index].dataset.ioAdvancedSort;
                    this.updateValues(value, 'update');
                }
            }
        });
    }

    // * advanced update
    advancedUpdate() {
        // * clean advanced drag
        this.advancedItems.map(item => {
            this.advancedOffBox.insertAdjacentElement('afterbegin', item);
            item.classList.remove('active-1');
            item.classList.remove('active-2');
        });

        // * update advanced drag
        this.orderBy.map(order => {
            this.advancedItems.map(item => {
                // * get advanced item value
                const value = item.dataset.ioAdvancedSort;
    
                // * compare values
                if (order == value) {
                    item.classList.add('active-2');
                    this.advancedDragBox.insertAdjacentElement('beforeend', item);
                }
                else if (order == `-${value}`) {
                    item.classList.add('active-1');
                    this.advancedDragBox.insertAdjacentElement('beforeend', item);
                }
            });

        });
    }

    // * advanced sort
    advancedSort() {

        this.advancedPlus();
        this.advancedAngle();

    }

    // * drag manager create
    drag() {
        this.dragObject = new Sortable(this.advancedDragBox, {
            animation: 150,
            handle: '.drag-handle'
        });
    }

    // * drag event listener
    dragEvent() {
        this.advancedItems.forEach(element => {
            element.ondragend = () => { 
                const values = [];
                const dragItems = this.getElements('[data-io-advanced-sort]', this.advancedDragBox);
                dragItems.map(item => {
                    if (item.classList.contains('active-1')) {
                        const value = `-${item.dataset.ioAdvancedSort}`;
                        values.push(value);
                    }
                    else if (item.classList.contains('active-2')) {
                        const value = item.dataset.ioAdvancedSort;
                        values.push(value);
                    }
                })
                this.orderBy = values;
                this.simpleUpdate();
            };
        });
    }

    // --> send request for order
    request() {

        // * create request data
        this.requestData = {
            compare: false,
            order: this.orderBy
        }

        // * get compare
        if (this.orderBy[0] == 'compare' || this.orderBy[0] == '-compare') {
            this.requestData['compare'] = JSON.parse(localStorage.getItem('cart'));
            this.requestData['order'] = this.requestData['order'].filter(value => { if (value !== 'compare' && value !== '-compare') { return value; } })
            this.requestData['compare'] = this.requestData['compare'].map(value => { return value.replace('chb_', ''); })
            this.requestData.compare_order = this.orderBy[0];
        } else {
            this.orderBy = this.orderBy.filter(value => { return value !== 'compare' && value !== '-compare' });
            this.requestData['order'] = this.orderBy;
        }

        // * set spiner
        this.viewContainer.innerHTML = this.getSpiner('get');

        // --> send ajax
        ajax(this.url, this.requestData, this.responce, this);
    }

    // * responce view
    responce(responce, context) {

        // @ remove spiner
        if (context.getSpiner('has')) { context.getSpiner('remove'); }

        // * add diamonds
        const responceData = JSON.parse(responce);
        responceData.map(diamond => {
            context.viewContainer.insertAdjacentHTML('beforeend', getDiamondHTML(diamond));
        });

        // * -------------------------- diamond drop down
        const diamondItem = new ElementsControl({
            manager: ".result__item-list",
            managed: ".result__drop-down",
        });
        diamondItem.toggler({
            single: true,
            notThis: ".label-result"
        });

        // * -------------------------- diamond more info
        const diamondMoreInfo = new ElementsControl({
            manager: ".btn-more--info",
            managed: ".body-more--info",
        });
        diamondMoreInfo.toggler({
            single: true
        });

        // * -------------------------- diamond label
        if (context.extention !== undefined && context.extention !== null) {
            const diamondLabel = new ElementsControl({
                manager: '[data-io-label="diamonds-item"]',
                managed: '.checkbox-results'
            });
            diamondLabel.label(
                // checked
                context.extention.checked,
                // unchecked
                context.extention.unchecked
            );
            context.extention.selected();
        }
    }

    // <-- get / remove - spiner HTML
    getSpiner(action = 'get') {
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
            const spin = this.viewContainer.querySelector('#loading-spiner');
            if (spin !== undefined && spin !== null) {
                spin.remove();
            }
        }
        else if (action == 'has') {
            const spin = this.viewContainer.querySelector('#loading-spiner');
            if (spin !== undefined && spin !== null) {
                return true;
            } else {
                return false;
            }
        }
    }
}