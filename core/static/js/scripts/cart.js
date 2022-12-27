"use strict";


class Sort {
    constructor(kwargs) {

        // create obj
        this.simple = {};
        this.advanced = {};
        this.sort = ['sale_price'];
        this.compare = {
            key: false,
            nums: null
        };
        this.url = kwargs.url || 'sort/';
        this.key = kwargs.key || 'result';
        this.cart = kwargs.cart;

        this.viewContainer = this._getElems(kwargs.viewContainer)[0];
        
        // simple 
        this.simple.container = this._getElems(kwargs.simpleContainer, document);
        this.simple.elems = this._getElems('[data-sort-simple]', this.simple.container[0]);

        // advanced
        this.advanced.container = this._getElems(kwargs.advancedContainer);
        this.advanced.elems = this._getElems('[data-sort-advanced]', this.advanced.container[0]);

        this.advanced.priority = this._getElems('[data-sort-priority]', this.advanced.container[0]);
        this.advanced.by = this._getElems('[data-sort-by]', this.advanced.container[0]);
        this.advanced.plus = this._getElems('.fa-plus', this.advanced.container[0]);
        this.advanced.angle = this._getElems('.fa-angle-down', this.advanced.container[0]);
        
        if (kwargs.debug == true) {this._debug();}
    }

    // @ init
    init() {
        this._simpleListener();
        this._plusListener();
        this._angleListener();
        this._dragInit();
        this._dragListener();
        return this;
    }
    _debug(log = this) {
        console.log(this);
    }
    _dragInit() {
        this.sortable = new Sortable(this.advanced.priority[0], {
            animation: 200,
            handle: '.drag-handle'
        });
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

        let photo = `<img src="/static/img/diamonds/base-diamond.jpg" alt="" class="img-fluid rounded">`

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
                <span>${diamond.fields.rap_disc}%</span>
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
                                    <span>Girdle: ${diamond.fields.girdle}</span>
                                </li>
                                <li class="result__drop-li">
                                    <span>Report №: ${diamond.fields.lab}</span>
                                </li>
                                <li class="result__drop-li">
                                    <span>Fluor: ${diamond.fields.fluor}</span>
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


    // <-- get elemetns
    _getElems(selector = String,  parent = document) {
        if (parent.length == undefined) {
            const query = [...parent.querySelectorAll(selector)];
            return query;
        }
        else {
            let nodes = [];
            parent.map(p => {
                const childs = p.querySelectorAll(selector);
                nodes = [...nodes, ...childs];
            });
            return nodes;
        }
    }
    // get by key
    _getByKey(key) {
        const obj = {
            simple: null,
            advanced: null
        }
        
        obj.advanced = this.advanced.elems.filter(elem => {
            if (elem.dataset.sortAdvanced == key) {return elem;} 
        });
        obj.simple = this.simple.elems.filter(elem => {
            if (elem.dataset.sortSimple == key) {return elem;} 
        });

        obj.simple = obj.simple[0];
        obj.advanced = obj.advanced[0];
        return obj;
    }


    // --> makers
    _changeDirection(simpleElem, advanceElem, direction) {
        // change direction
        if (direction == 'up') {
            simpleElem.dataset.sortDirection = 'down';
            advanceElem.dataset.sortDirection = 'down';
        }
        else if (direction == 'down') {
            simpleElem.dataset.sortDirection = 'up';
            advanceElem.dataset.sortDirection = 'up';
        }
    }
    _simpleCleane() {
        this.simple.elems.map(elem => {
            elem.classList.remove('active');
        });
    }
    _jumpAdvanced(element, mode = 'by' || 'prority') {
        if (mode == 'by') {
            this.advanced.by[0].insertAdjacentElement('afterbegin', element);
        }
        else if (mode == 'priority') {
            this.advanced.priority[0].insertAdjacentElement('afterbegin', element);
        }
    }
    _updateSort() {
        // create sort direction
        this.sort = [];
        const elems = this._getElems('[data-sort-advanced]', this.advanced.priority);
        elems.map(elem => {
            let key = elem.dataset.sortAdvanced;
            const direction = elem.dataset.sortDirection;
            if (direction == 'down') {
                key = `-${key}`
            }
            this.sort.push(key);
        });

        
        if (this.sort[0] == 'compare' || this.sort[0] == '-compare') {
            this.compare.key = this.sort[0];
            this.compare.nums = JSON.parse(localStorage.getItem('cart'));
            this.compare.nums = this.compare.nums.map(num => {return num.replace('chb_', '')});
        }

        this.sort = this.sort.filter(str => {
            if (str != 'compare' && str != '-compare') {return str;}
        });
        this.apply();
    }

    checkLabel(inputs, labels) {

        const checks = JSON.parse(localStorage.getItem('cart'));
        inputs.forEach((inp, index) => {
            const name = inp.name;

            checks.forEach(check => {
                if (name == check) {
                    inp.check = true;
                    labels[index].classList.add('active');
                }
            });
        });

    }


    // --> Events
    _dragListener() {
        this.advanced.dragElems = this._getElems('[data-sort-advanced]', this.advanced.priority);
        this.advanced.dragElems.map(elem => {
            elem.ondragend = (e) => {
                const target = e.target;
                if (target === elem) {
                    this._updateSort();
                }
            };
        });
    }
    _plusListener() {
        this.advanced.plus.map(p => {
            p.addEventListener('click', () => {
                const advanceElem = p.parentElement.parentElement;
                const simpleElem = this._getByKey(advanceElem.dataset.sortAdvanced).simple;
                if (!advanceElem.classList.contains('active')) {
                    this._simpleCleane();
                    advanceElem.classList.add('active');
                    simpleElem.classList.add('active');
                    this._jumpAdvanced(advanceElem, 'priority')
                }
                else if (advanceElem.classList.contains('active')) {
                    advanceElem.classList.remove('active');
                    simpleElem.classList.remove('active');
                    this._jumpAdvanced(advanceElem, 'by')
                }

                // update sort object
                this._dragListener() 
                this._updateSort();
            });
        });
    }
    _angleListener() {
        this.advanced.angle.map(a => {
            a.addEventListener('click', () => {
                const advanceElem = a.parentElement.parentElement;
                const simpleElem = this._getByKey(advanceElem.dataset.sortAdvanced).simple;
                const direction = advanceElem.dataset.sortDirection;

                this._changeDirection(simpleElem, advanceElem, direction);

                // update sort object
                this._updateSort();
            });
        });
    }
    _simpleListener() {
        const simpleElems = this.simple.elems;
        simpleElems.map(simpleElem => {
            simpleElem.addEventListener('click', () => {
                const current = this._getByKey(simpleElem.dataset.sortSimple);
                const direction = simpleElem.dataset.sortDirection;
                
                // clean simple
                this._simpleCleane();
                
                simpleElem.classList.add('active');
                current.advanced.classList.add('active');
                
                // change direction
                this._changeDirection(simpleElem, current.advanced, direction);

                // jump advanced
                this._jumpAdvanced(current.advanced, 'priority');

                // update sort object
                this._dragListener();
                this._updateSort();
            });
        });
    }

    apply() {
        this.viewContainer.innerHTML = '';
        this.viewContainer.insertAdjacentHTML('afterbegin', this.spinerView('get'));
        this.data = {
            sort: this.sort,
            compare: this.compare,
        }
        ajax(this.url, this.data, this.updateView, this);
    }

    updateView(responce, context) {
        context.viewContainer.innerHTML = '';
        const diamonds = JSON.parse(responce);
        diamonds.map(diamond => {
            context.viewContainer.insertAdjacentHTML('afterbegin', context.getDiamondHTML(diamond));
        });
        

        // * -------------------------- diamond drop down
        const diamondItem = new ElementsControl({
            manager: ".result__item-list",
            managed: ".result__drop-down",
        });
        diamondItem.toggler({ single: true, notThis: ".label-result" });

        // * -------------------------- diamond more info
        const diamondMoreInfo = new ElementsControl({
            manager: ".btn-more--info",
            managed: ".body-more--info",
        });
        diamondMoreInfo.toggler({ single: true });

        // * -------------------------- diamond label
        const diamondLabel = new ElementsControl({
            manager: '[data-io-label="diamonds-item"]',
            managed: '.checkbox-results'
        });
        diamondLabel.label(
            // checked
            context.cart.checked,
            // unchecked
            context.cart.unchecked
        );

        context.checkLabel(diamondLabel.managed, diamondLabel.manager);
    }


    
}

// * Cart actions
class Cart {
    constructor(kwargs) {

        // delete selected button
        this.deleteButton = document.querySelector(kwargs.deleteButton); 

        // active key
        this.activeKey = 'cart';

        // get contaner for diamonds
        this.container = document.querySelector(kwargs.container);
        this.msg = document.querySelector(kwargs.msg);

        // buy responce values
        this.formBuy = document.querySelector(kwargs.formBuy);
        this.formHold = document.querySelector(kwargs.formHold);
        this.formMemo = document.querySelector(kwargs.formMemo);
        this.formMessage = document.querySelector(kwargs.formMessage);

        // total info
        this.total_carat = document.querySelector(kwargs.total_carat);
        this.total_price = document.querySelector(kwargs.total_price);
        this.total_stone = document.querySelector(kwargs.total_stone);
        this.cart_length = document.querySelector(kwargs.cart_length);

        // cart init
        this.init();

    }

    // init
    init() {

        // * create local storage
        localStorage.setItem('cart', JSON.stringify([]));

        // <-- get diamonds list
        this.diamonds = [...this.container.querySelectorAll('.result-section--element')];
        this.diamonds_chb = this.diamonds.map(diamond => {
            return diamond.querySelector('input[type="checkbox"]');
        });

        // * delete selected diamonds - method
        this.deleteSelected();

        // ? forms
        this.orderSubmit(this.formBuy);
        this.orderSubmit(this.formMemo);
        this.orderSubmit(this.formHold);
        this.msgSubmit(this.formMessage, '/cart/send_list/');

        // * return this
        return this;
    }


    // debug
    debug(info = this) {
        console.log(info);
        return this;
    }

    // cheched / unchecked
    unchecked(value) {

        // get storage values
        let values = JSON.parse(localStorage.getItem('cart'));

        // update values
        values = values.filter(v => {
            if (v !== value) { return v; }
        });

        // update storage
        localStorage.setItem('cart', JSON.stringify(values));
    }
    checked(value) {
        // get storage values
        const values = JSON.parse(localStorage.getItem('cart'));

        // update values
        values.push(value);
        
        // set new storage
        localStorage.setItem('cart', JSON.stringify(values));
    }

    // clean cart info
    cleanInfo() {
        this.total_price.textContent = 0;
        this.total_carat.textContent = 0;
        this.total_stone.textContent = 0;
        this.cart_length.textContent = 0;
    }
    updateInfo(responce) {
        this.total_price.textContent = Math.floor((Number(this.total_price.textContent.replace('$', '')) - responce.order_data.total_price));
        this.total_carat.textContent = (this.total_carat.textContent - responce.order_data.total_carat).toFixed(1)
        this.total_stone.textContent = this.total_stone.textContent - responce.order_data.total_diamonds;
        this.cart_length.textContent = this.total_stone.textContent;
        return this.total_stone.textContent;
    }


    // -- delete selected
    removeByKey(pks, parent = document) {
        pks.map(key => {
            const node = parent.querySelector(`#${key}`);
            const elem = node.closest('.result-section--element');
            elem.remove();
        });
    }
    deleteSelected() {

        // * create delete event
        this.deleteButton.addEventListener('click', () => {

            // get delete values
            let deleteValues = JSON.parse(localStorage.getItem('cart'));

            // get DOM elemetns for delete
            this.removeByKey(deleteValues, this.container);

            // clear cart storage
            localStorage.setItem('cart', JSON.stringify([]));

            // delete
            if (deleteValues.length !== 0) {

                // turning it into a key
                deleteValues = deleteValues.map(value => {
                    return value.replace('chb_', '');
                });
                
                // --> send reques
                ajax('delete_selected/', deleteValues, this.afterDelete, this);
                
            }

        });
    }
    afterDelete(responce, context) {
        context.total_price.textContent = responce.total_price;
        context.total_carat.textContent = responce.total_carat;
        context.total_stone.textContent = responce.total_stone;
        context.cart_length.textContent = responce.total_stone;
    }

    // -- Form Data
    orderSubmit(form, url = '/orders/create/') {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const button = form.querySelector('button[type="submit"]');
            const button_text = button.querySelector('.order-btn-text')
            const button_main_text = button_text.textContent;
            
            button_text.textContent = 'Order creating';
            button.classList.add('active');
            button.setAttribute('disabled', true);

            this.active_button = {
                text: button_main_text,
                btn_text: button_text,
                btn: button
            }

            // * create empty form values
            const formData = {}

            // * get form items
            const inputs = [...form.querySelectorAll('input, textarea')];

            // --> get values from form
            inputs.map(input => {
                if (input.type == 'radio' && input.checked || input.type !== 'radio') {
                    formData[input.name] = input.value;
                }
            });

            for (let key in formData) {
                if (key == 'pay_within' || key == 'p_ct_offer' || key == 'total_price_offer') {
                    formData[key] = 0;
                }
            }

            // if cart checked exists
            const cartChecked = JSON.parse(localStorage.getItem('cart'));
            if (cartChecked) {
                formData.checked = cartChecked.map(item => {
                    return item.replace('chb_', '');
                });
            }

            ajax(url, formData, this.afterSubmit, this);
        });
    }
    afterSubmit(responce, context) {
        
        const emptyCart = `
            <div class="w-100 py-4 d-flex align-items-center justify-content-center border flex-column">
                <h3 class="h3 text-success">Your shopping cart is empty</h3>
                <p class="text-dark fs-5">
                    <span>
                        Go to Products
                    <span>
                    <a href="/filter/" class="text-success">Filter</a>
                </span></span></p>
            </div>
        `;
        
        const shopping_alert = document.querySelector('.shopping_alert');
        const forms = [context.formBuy.parentElement.parentElement, context.formMemo.parentElement.parentElement, context.formHold.parentElement.parentElement];
        const close_btns = [];
        forms.map(form => {
            let btn = form.querySelector('.btn-close');
            close_btns.push(btn);
        });
        close_btns.map(btn => {
            btn.click();
        });

        const btn = context.active_button.btn;
        const btn_text = context.active_button.btn_text;
        const btn_old_text = context.active_button.text;

        btn.classList.remove('active');
        btn.removeAttribute('disabled');
        btn_text.textContent = btn_old_text;

        if (responce.alert == 'success') {
            shopping_alert.innerHTML = `<div class="alert alert-success mt-2 shadow-sm alert-dismissible fade show border-0" role="alert">
                                            <div class="my-2">
                                                <div class="d-flex align-items-center justify-content-center">
                                                    <i class="fa fa-exclamation-circle me-2 fs-5" aria-hidden="true"></i>
                                                    <h5 class="h5 m-0 p-0">Your order was created ! Order number: #${responce.order_data.order_number} - Go to <a href="/orders/" class="link">Orders</a></h5>
                                                </div>
                                                <button type="button" class="btn-close shadow-none border-none" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>
                                        </div>
            `;
        } 
        else if (responce.alert == 'empty') {
            shopping_alert.innerHTML = `<div class="alert alert-warning mt-2 shadow-sm alert-dismissible fade show border-0" role="alert">
                                            <div class="my-2">
                                                <div class="d-flex align-items-center justify-content-center">
                                                    <i class="fa fa-exclamation-circle me-2 fs-5" aria-hidden="true"></i>
                                                    <h5 class="h5 m-0 p-0">Shopping cart can not be empty !</h5>
                                                </div>
                                                <button type="button" class="btn-close shadow-none border-none" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>
                                        </div>
            `;
        } 
        else if (responce.alert == 'error') {
            shopping_alert.innerHTML = `<div class="alert alert-danger mt-2 shadow-sm alert-dismissible fade show border-0" role="alert">
                                            <div class="my-2">
                                                <div class="d-flex align-items-center justify-content-center">
                                                    <i class="fa fa-exclamation-circle me-2 fs-5" aria-hidden="true"></i>
                                                    <h5 class="h5 m-0 p-0">Something was wrong, order was not created</h5>
                                                </div>
                                                <button type="button" class="btn-close shadow-none border-none" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>
                                        </div>
            `;
        }
        
        // cart is empty 
        const storage =  JSON.parse(localStorage.getItem('cart'));
        if (storage.length != 0) {
            storage.map(value => {
                context.diamonds_chb.map((chb, index) => {
                    if (chb.name == value) {
                        context.diamonds[index].remove();
                    }
                });
            });
            localStorage.setItem('cart', JSON.stringify([]));
            const len = context.updateInfo(responce);
            if (len == 0) {
                context.container.innerHTML = emptyCart;
            }
        }
        else {
            context.cleanInfo();
            context.container.innerHTML = emptyCart;
        }
    }

    msgSubmit(form, url = '/cart/send_list/') {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const button = form.querySelector('button[type="submit"]');
            const button_text = button.querySelector('.order-btn-text')
            const button_main_text = button_text.textContent;
            
            button_text.textContent = 'Sending a wish list';
            button.classList.add('active');
            button.setAttribute('disabled', true);

            
            const formData = {
                msg: '',
                carat: this.total_carat.textContent,
                stone: this.total_stone.textContent,
                price: this.total_price.textContent.replace('$', ''),
            }
            const input = form.querySelector('textarea');
            formData.msg = input.value;

            
            ajax(url, formData, this.afterMsg, this);
        });
    }
    afterMsg(responce, context) {
        let type = 'info';
        if (responce.alert == 'error') {type = 'danger';}
        const alert = `
            <div class="alert alert-${type} mt-2 shadow-sm alert-dismissible fade show border-0" role="alert">
                <div class="my-2">
                    <div class="d-flex align-items-center justify-content-center">
                        <i class="fa fa-exclamation-circle me-2 fs-5" aria-hidden="true"></i>
                        <h5 class="h5 m-0 p-0">${responce.msg}</h5>
                    </div>
                    <button type="button" class="btn-close shadow-none border-none" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>`;

        const form = context.formMessage;
        const btnClose = form.querySelector('.btn-close');
        btnClose.click();

        const button = form.querySelector('button[type="submit"]');
        const button_text = button.querySelector('.order-btn-text')
        button_text.textContent = 'Send your wish list';
        button.classList.remove('active');
        button.removeAttribute('disabled');

        context.msg.innerHTML = '';
        context.msg.insertAdjacentHTML('afterbegin', alert);
    }


}

// * DOM Content Loaded * //;
document.addEventListener("DOMContentLoaded", () => {

    // * -------------------------- create cart object
    const cart = new Cart({
        deleteButton: '#delete-selected',
        container: '#cart-items',
        formBuy: '#form-buy',
        formMemo: '#form-memo',
        formHold: '#form-hold',
        formMessage: '#form-wish-list',
        msg: '#cart_msg',

        total_price: '#total_price',
        total_carat: '#total_carat',
        total_stone: '#total_stone',
        cart_length: '#cart_length'
    });

    // * -------------------------- diamond drop down
    const diamondItem = new ElementsControl({
        manager: ".result__item-list",
        managed: ".result__drop-down",
    });
    diamondItem.toggler({ single: true, notThis: ".label-result" });

    // * -------------------------- diamond more info
    const diamondMoreInfo = new ElementsControl({
        manager: ".btn-more--info",
        managed: ".body-more--info",
    });
    diamondMoreInfo.toggler({ single: true });

    // * -------------------------- diamond label
    const diamondLabel = new ElementsControl({
        manager: '[data-io-label="diamonds-item"]',
        managed: '.checkbox-results'
    });
    diamondLabel.label(
        // checked
        cart.checked,
        // unchecked
        cart.unchecked
    );

    // * -------------------------- hold hours
    function hoursToggle() {
        // hours container
        const hours = document.querySelector('#hours-item');
        // hours value
        const hoursValue = hours.querySelector('#hold-hours--title');
        // hours items
        const hoursItems = hours.querySelectorAll('.hold-hours__select');
        // hours input
        const hoursInput = hours.querySelector('#hold-hours--option')

        // hours toggle
        hours.addEventListener('click', () => {
            hours.classList.toggle('active');
            
        });
        // hours item text content
        hoursItems.forEach(elem => {
            elem.addEventListener('click', () => {
                // hours item value
                let value = elem.textContent;
                // hours value set new value
                hoursValue.textContent = value;
                hoursInput.value = value;
            })
        });
    }
    hoursToggle();

    // * -------------------------- rscroll fix
    const scrollFix = new ScrollFix({
        container: '#cart-items'
    });

    // * -------------------------- cart sort
    const cartSort = new Sort({


        cart: cart,

        viewContainer: '#cart-items',

        // * simple sort items
        simpleContainer: '#cart_simple_sort',
        
        // * advanced sort items
        advancedContainer: '#cart-sort-modal', 

        // * url for reqest/responce
        url: 'sort/',
 
    });
    cartSort.init();
    
});
