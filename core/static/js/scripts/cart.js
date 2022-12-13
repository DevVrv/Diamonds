"use strict";

// * Cart actions
class Cart {
    constructor(kwargs) {

        // delete selected button
        this.deleteButton = document.querySelector(kwargs.deleteButton); 

        // active key
        this.activeKey = 'cart';

        // get contaner for diamonds
        this.container = document.querySelector(kwargs.container);

        // buy responce values
        this.formBuy = document.querySelector(kwargs.formBuy);
        this.formHold = document.querySelector(kwargs.formHold);
        this.formMemo = document.querySelector(kwargs.formMemo);

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
        this.orderSubmit(this.formBuy, this);
        this.orderSubmit(this.formMemo, this);
        this.orderSubmit(this.formHold, this);

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
    orderSubmit(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const button = form.querySelector('button[type="submit"]');
            const button_text = button.querySelector('.order-btn-text')
            const button_main_text = button_text.textContent;
            
            button_text.textContent = 'Order creating'
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
                formData.checked = cartChecked.map(
                    item => {``
                        return item.replace('chb_', '');
                    });
            }

            ajax('/orders/create/', formData, this.afterSubmit, this);
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
