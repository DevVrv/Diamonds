"use strict";

// * Cart actions
class Cart {
    constructor(kwargs) {

        // @ delete selected button
        this.deleteButton = document.querySelector(kwargs.deleteButton); 

        // * active key
        this.activeKey = 'cart';

        // * get contaner for diamonds
        this.container = document.querySelector(kwargs.container);

        // * buy responce values
        this.formBuy = document.querySelector(kwargs.formBuy);
        this.formHold = document.querySelector(kwargs.formHold);
        this.formMemo = document.querySelector(kwargs.formMemo);

        // * total info
        this.total_carat = document.querySelector(kwargs.total_carat);
        this.total_price = document.querySelector(kwargs.total_price);
        this.total_stone = document.querySelector(kwargs.total_stone);
        this.cart_length = document.querySelector(kwargs.cart_length);

        // * cart init
        this.init();

    }

    // * init
    init() {

        // * create local storage
        localStorage.setItem('cart', JSON.stringify([]));

        // * delete selected diamonds - method
        this.deleteSelected();

        // ? forms
        this.getFormData(this.formBuy, this);
        this.getFormData(this.formMemo, this);
        this.getFormData(this.formHold, this);

        // * return this
        return this;
    }

    // * debug
    debug(info = this) {
        console.log(info);
        return this;
    }

    // * unchecked function
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

    // * checked function
    checked(value) {
        // get storage values
        const values = JSON.parse(localStorage.getItem('cart'));

        // update values
        values.push(value);
        
        // set new storage
        localStorage.setItem('cart', JSON.stringify(values));
    }

    // * get elements in arr
    removeByKey(pks, parent = document) {
        pks.map(key => {
            const node = parent.querySelector(`#${key}`);
            const elem = node.closest('.result-section--element');
            elem.remove();
        });
    }

    // * delete selected
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

    // * after deleted
    afterDelete(responce, context) {
        context.total_price.textContent = responce.total_price;
        context.total_carat.textContent = responce.total_carat;
        context.total_stone.textContent = responce.total_stone;
        context.cart_length.textContent = responce.total_stone;
    }

    // * after submit
    afterSubmit(responce, context) {
        context.container.innerHTML = '';
        context.total_price.textContent = 0;
        context.total_carat.textContent = 0;
        context.total_stone.textContent = 0;
        if (context.cart_length !== undefined && context.cart_length !== null) { context.cart_length.remove(); }
        context.alert(responce.alert, context.submitedForm);
    }

    // * create alert
    alert(type, parent) {

        const error = `
        <div class="alert alert-danger border-0 shadow-sm" role="alert" id="responce_message">
            <h5 class="h5">Error: The basket cannot be empty</h5>
            You can get acquainted with the goods by following this link
            <a href="/" class="fs-5 link">Diamonds</a>
        </div>
        `;
        const success = `
        <div class="alert alert-success border-0 shadow-sm" role="alert" id="responce_message">
           <h5 class="h5">Success: your request was placed!</h5> <br>
            You can view it at this link <a href="/orders/" class="fs-5 link">Orders</a>
        </div>
        `;

        let message = ''
        
        if (type == 'success') { message = success; }
        else if (type == 'error') { message = error; }

        const messageElement = parent.querySelector('#responce_message');
        if (messageElement !== null && messageElement !== undefined) { messageElement.remove(); }

        const body = parent.querySelector('.modal-body');

        body.insertAdjacentHTML('afterbegin', message)
    }

    // --> get form data
    getFormData(form, context) {
        form.onsubmit = (e) => {

            context.submitedForm = form;

            e.preventDefault();

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

            
            ajax('/orders/create/', formData, this.afterSubmit, this);
        }
    }

    // --> checked
    selected() {
        const selected = JSON.parse(localStorage.getItem('cart'));
        
        const nodes = selected.map(value => {
            return this.container.querySelector(`#${value}`);
        });

        nodes.map(node => {
            node.checked = true;
            node.parentElement.classList.add('active');
        });
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

        total_price: '#total_price',
        total_carat: '#total_carat',
        total_stone: '#total_stone',
        cart_length: '#cart_length'
    }).init();

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
    const cartSort = new SortSystem({

        viewContainer: '#cart-items',

        // * simple sort items
        simpleContainer: '#cart_simple_sort',
        simpleItems: '[data-io-simple-sort]',
        
        // * advanced sort items
        advancedContainer: '#cart-sort-modal', 
        advancedDragBox: '#cart-name-priority', 
        advancedOffBox: '#cart-name-sort', 
        advancedItems: '[data-io-advanced-sort]', 

        // * advanced extencions
        plusItems: '.fa-plus',
        angleItems: '.fa-angle-down',

        // * url for reqest/responce
        url: 'sort/',

        extention: cart
 
    });
    cartSort.init();
    
});
