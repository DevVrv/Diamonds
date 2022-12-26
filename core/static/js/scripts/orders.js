"use strict";

class Orders {

    constructor(kwargs) {

        this.kwargs = kwargs;

        // * values display
        this.valuesLists = {
            clarityList: ['I3', 'I2', 'I1', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FI'],
            cutList: ['N/A', 'Fair', 'Good', 'Very Good', 'Ideal', 'Super Ideal', 'Excellent'],
            colorList: ['M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D'],
            shapeList: ['Round', 'Marquise', 'Asscher', 'Cushion', 'Emerald', 'Heart', 'Oval', 'Pear', 'Princess', 'Radiant', 'Another'],
            symmetryList: ['N/A', 'Good', 'Very Good', 'Excellent'],
            polishList: ['N/A', 'Good', 'Very Good', 'Excellent'],
            fluourList: [
                'None',
                'Faint',
                'Medium',
                'Strong',
                'Very Strong'
            ],
            labList: [
                'IGI',
                'GIA',
                'GCAl',
                'HDR'
            ],
            status_list: [
                'Rejected',
                'On verification',
                'Order accepted',
                'Delivery is in progress',
                'Delivered',
                'Completed',
            ],
            type_list: [
                'COD',
                'Invocie',
                'Cash Memo',
                'Memo',
                'Hold',
            ]
        };

        // * craete request object
        this.request = {}

        // * search form-controls
        this.searchForm = this.getElement(kwargs.search);
        this.searchBody = this.getElement(kwargs.searchBody);
        this.searchTriger = this.getElement(kwargs.searchTriger);

        // * orders items
        this.ordersContainer = this.getElement(kwargs.ordersContainer);
        this.orders = {
            orders: this.getElemetns(kwargs.orders, this.ordersContainer),
            orderStatus: this.getElemetns(kwargs.orderStatus, this.ordersContainer),
            orderType: this.getElemetns(kwargs.orderType, this.ordersContainer),
            orderPlaced: this.getElemetns(kwargs.orderPlaced, this.ordersContainer),
            orderLen: this.getElemetns(kwargs.orderLen, this.ordersContainer),
            orderCarat: this.getElemetns(kwargs.orderCarat, this.ordersContainer),
            orderPrice: this.getElemetns(kwargs.orderPrice, this.ordersContainer),
            orderNumber: this.getElemetns(kwargs.orderNumber, this.ordersContainer),
            orderDetails: this.getElemetns(kwargs.orderDetails, this.ordersContainer),
            orderInvoice: this.getElemetns(kwargs.orderInvoice, this.ordersContainer),
        };

        // * details modal
        this.modalDetails = this.getElement(kwargs.modalDetails);
        this.modalDetailsItems = {
            close: this.getElement(kwargs.closeModal, this.modalDetails),
            type: this.getElement(kwargs.modalType, this.modalDetails),
            number: this.getElement(kwargs.modalNumber, this.modalDetails),
            status: this.getElement(kwargs.modalStatus, this.modalDetails),
            placed: this.getElement(kwargs.modalPlaced, this.modalDetails),
            len: this.getElement(kwargs.modalLen, this.modalDetails),
            carat: this.getElement(kwargs.modalCarat, this.modalDetails),
            price: this.getElement(kwargs.modalPrice, this.modalDetails),
            content: this.getElement(kwargs.modalContent, this.modalDetails),
        }

        // * invocie modal
        this.modalInvoice = this.getElement(kwargs.modalInvoice);
        this.modalInvoiceItems = {
            close: this.getElement(kwargs.closeModal, this.modalInvoice),
            buyer: this.getElement(kwargs.modalBuyer, this.modalInvoice),
            attn: this.getElement(kwargs.modalAttn, this.modalInvoice),
            address: this.getElement(kwargs.modalAddress, this.modalInvoice),
            tel: this.getElement(kwargs.modalTel, this.modalInvoice),
            price: this.getElement(kwargs.modalPrice, this.modalInvoice),
            content: this.getElement(kwargs.modalContent, this.modalInvoice),
        }
        
        // * key
        this.key = 'details';
        this.alert_container = document.querySelector('.alert_block');

        this.init();
    }
    
    // init methods
    init() {
        this.closeModal(this.modalDetailsItems.close, this.modalDetails);
        this.closeModal(this.modalInvoiceItems.close, this.modalInvoice);
        this.makeRequest(this.orders.orderDetails, this.modalDetails);
        this.makeRequest(this.orders.orderInvoice, this.modalInvoice);

        this.search('search/');
        this.searchShow();
        this.removeOrder();
        this.dateValidation();
    }

    // debug mode
    debug(info = this) {
        return this;
    }

    // get single element
    getElement(selector, parent = document) {
        return parent.querySelector(selector);
    }

    // get elemetns list
    getElemetns(selector, parent = document) {
        return [...parent.querySelectorAll(selector)]
    }

    // close modal
    closeModal(trigger, modal) {
        trigger.onclick = () => {
            modal.classList.remove('active');
        }
    }

    // <-- get spiner HTML
    spiner(action = 'get') {
        if (action == 'get') {
            const spin =
            `            
            <div class="text-center text-primary py-4 shadow-sm w-100 bg-lite border-bottom" id="loading-spiner">
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

    // <-- get order HTML
    getOrderHTML(order, date, i) {

        let alert = 'text-success';
        if (order.fields.order_status == '0') {alert = 'text-danger'}
        else if (order.fields.order_status == '1') {alert = 'text-alert'}
        
        const orderHTML = `
            <div class="orders__item shadow-sm border" data-orders-item="${order.fields.order_number}">
            <div class="orders__item-header py-3 px-3">
                <ul class="orders__item-header-list m-0">
                    <li class="orders__item-header-element pe-4">
                        <span class="text-capitalize fs-5 text-primary" data-order-type="${this.valuesLists.type_list[order.fields.order_type]}">${this.valuesLists.type_list[order.fields.order_type]}</span>
                    </li>
                    <li class="orders__item-header-element orders__item--date">
                        <span class="text-uppercase">Order Placed</span>
                        <span class="orders__item--value" data-order-placed="${date[i]}">${date[i]}</span>
                    </li>
                    <li class="orders__item-header-element">
                        <span class="text-uppercase">Total Diamonds:</span>
                        <span class="orders__item--value" data-order-diamonds="${order.fields.total_diamonds}">${order.fields.total_diamonds}</span>
                    </li>
                    <li class="orders__item-header-element">
                        <span class="text-uppercase">Total Carat:</span>
                        <span class="orders__item--value" data-order-carat="${order.fields.total_carat}">${order.fields.total_carat}</span>
                    </li>
                    <li class="orders__item-header-element">
                        <span class="text-uppercase">Total Price:</span>
                        <span class="orders__item--value">$<span data-order-price="${order.fields.total_price}">${order.fields.total_price}</span></span>
                    </li>
                </ul>
                
                <div class="orders__item-header-number">

                    <div class="d-flex">
                        <span class="text-uppercase">Order Number #</span>
                        <span class="text-capitalize" data-order-number="${order.fields.order_number}">${order.fields.order_number}</span>
                    </div>
                    
                    <div class="d-flex mt-2 orders__header-buttons">
                        <button type="button" class="link bg-none fs-5 me-3" data-view-details="order_details">View order details</button>
                        <button type="button" class="link bg-none fs-5" data-view-invoice="view_invoice">View invoice</button>
                    </div>
                </div>
            </div>
            <div class="orders__item-footer py-3 px-3 border-top">
                <span class="fs-5 d-block ${alert}"> Status: ${this.valuesLists.status_list[order.fields.order_status]}</span>
            </div>
        </div>
        `;

        return orderHTML;

    }

    // * get order details
    makeRequest(triggers, modal, url = "details/") {
        triggers.map((trigger, i) => {
            trigger.onclick = () => {

                // * make key
                let modalItems;
                if (modal == this.modalDetails) { this.key = 'details'; modalItems = this.modalDetailsItems; }
                else if (modal == this.modalInvoice) { this.key = 'invoice'; modalItems = this.modalInvoiceItems; }

                // <-- get number
                const number = this.orders.orders[i].dataset.ordersItem;

                // * show modal
                modal.classList.add('active');

                // * update request object
                this.request['number'] = number;

                // --> send request
                modalItems.content.innerHTML = '';
                modalItems.content.insertAdjacentHTML('afterbegin', this.spiner('get'));
                ajax(url, this.request, this.makeResponce, this);
            }
        });
    }

    // * make responce
    makeResponce(responce, context) {
        // <-- get diamonds list
        const diamonds = JSON.parse(responce.diamonds);
       
        // * check context key
        let modal;
        let modalItems;
        if (context.key == 'details') {
            modal = context.modalDetails;
            modalItems = context.modalDetailsItems;

            // * update modal view
            modalItems.type.textContent = context.valuesLists.type_list[responce.type];
            modalItems.len.textContent = responce.len;
            modalItems.carat.textContent = responce.carat;
            modalItems.price.textContent = responce.price;
            modalItems.status.textContent = context.valuesLists.status_list[responce.status];
            modalItems.number.textContent = `#${responce.number}`;
            modalItems.placed.textContent = responce.placed;

            // * color of status
            if (responce.status == '0') {
                modalItems.status.classList.remove('text-success');
                modalItems.status.classList.remove('text-alert');
                modalItems.status.classList.add('text-danger');
            }
            else if (responce.status == '1') {
                modalItems.status.classList.remove('text-success');
                modalItems.status.classList.remove('text-danger');
                modalItems.status.classList.add('text-alert');
            }
            else {
                modalItems.status.classList.remove('text-danger');
                modalItems.status.classList.remove('text-alert');
                modalItems.status.classList.add('text-success');
            }
        }
        else if (context.key == 'invoice') {
            modal = context.modalInvoice;
            modalItems = context.modalInvoiceItems;

            modalItems.buyer.textContent = `${responce.last_name} ${responce.first_name}`;
            modalItems.attn.textContent = `${responce.last_name} ${responce.first_name}`;
            modalItems.address.textContent = responce.address;
            modalItems.tel.textContent = responce.tel;
            modalItems.price.textContent = responce.price;
        }

        // * set diamonds items
        modalItems.content.innerHTML = '';
        diamonds.map(diamond => {
            modalItems.content.insertAdjacentHTML('beforeend', getDiamondHTML(diamond));
        });
    
    }

    // * search show
    searchShow() {
        this.searchTriger.addEventListener('click', () => {
            this.searchBody.classList.toggle('active');
        });
    }

    // * search
    search(url = 'search/') {
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // <-- get inputs from DOM
            const inputs = this.getElemetns('input', this.searchForm);
            
            // * create fields object
            const fields = {};

            // * update fields object
            inputs.map(input => {
                const name = input.name;
                fields[name] = input.value;
            });

            // search
            let search_number = '';
            if (fields.search.length < 10) {
                let num = 10 - fields.search.length;

                for (let i = 0; i < num; i++) {
                    search_number += '0'
                }

                fields.search = `${search_number}${fields.search}`;
            }  

            // * set spiner
            this.ordersContainer.innerHTML = '';
            this.ordersContainer.insertAdjacentHTML('afterbegin', this.spiner('get'));
            
            // --> send request
            ajax(url, fields, this.searchResponce, this);
        });
    }

    // * search responce
    searchResponce(responce, context) {
        // * create orders
        const orders = JSON.parse(responce.orders);
        const date = responce.date;

        context.ordersContainer.innerHTML = '';
        
        if (orders.length != 0) {
            orders.map((order, i) => {
                context.ordersContainer.insertAdjacentHTML('beforeend', context.getOrderHTML(order, date, i));
            });
        } else {
            const empty = `
            <div class="alert alert-warning mt-2 shadow-sm alert-dismissible fade show border-0 w-100" role="alert">
                <div class="my-2">
                    <div class="d-flex align-items-center justify-content-center">
                        <i class="fa fa-exclamation-circle me-2 fs-5" aria-hidden="true"></i>
                        <h5 class="h5 m-0 p-0">No orders were found for your request</h5>
                    </div>
                </div>
            </div>`; 
            context.ordersContainer.insertAdjacentHTML('beforeend', empty);
        }

        context.orders.orderDetails = context.getElemetns(context.kwargs.orderDetails, context.ordersContainer);
        context.orders.orderInvoice = context.getElemetns(context.kwargs.orderInvoice, context.ordersContainer);

        context.makeRequest(context.orders.orderDetails, context.modalDetails);
        context.makeRequest(context.orders.orderInvoice, context.modalInvoice);
    }

    // remove order
    removeOrder() {
        const remove = [...document.querySelectorAll('.remove-order')];
        remove.map(btn => {
            btn.addEventListener('click', () => {
                const number = btn.dataset.orderNumber;
                const backdrop = document.querySelector('.modal-backdrop');
                backdrop.remove();
                ajax('/orders/remove/', number, this.afterRemoveOrder, this);
            });
        });
    }

    // remove oreder callback
    afterRemoveOrder(responce, context) {
        const order = document.querySelector(`[data-orders-item="${responce.number}"]`);
        order.remove();
        const alert = `
            <div class="alert alert-warning mt-2 shadow-sm alert-dismissible fade show border-0" role="alert">
                <div class="my-2">
                    <div class="d-flex align-items-center justify-content-center">
                        <i class="fa fa-exclamation-circle me-2 fs-5" aria-hidden="true"></i>
                        <h5 class="h5 m-0 p-0">Order #${responce.number} was removed.</h5>
                    </div>
                    <button type="button" class="btn-close shadow-none border-none" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>`;
        context.alert_container.innerHTML = alert;
        document.documentElement.scrollTo({
            'top': 0
        });
    }

    // date validator
    dateValidation() {
        this.dateInputs = [...this.searchForm.querySelectorAll('input[type="date"]')];
        this.dateInputs.map(input => {
            input.addEventListener('input', () => {
                if (input.value.length > 10) {
                    let value = input.value;
                    value = value.slice(value.length - 10, value.length);
                    input.value = value;
                }
            });
        });
    }
}

const orders = new Orders({
    // ? orders items
    ordersContainer: '#orders_items',
    orders: '[data-orders-item]',
    orderStatus: '[data-order-status]',
    orderType: '[data-order-type]',
    orderPlaced: '[data-order-placed]',
    orderLen: '[data-order-diamonds]',
    orderCarat: '[data-order-carat]',
    orderPrice: '[data-order-price]',
    orderNumber: '[data-order-number]',
    orderDetails: '[data-view-details]',
    orderInvoice: '[data-view-invoice]',

    modalDetails: '#order_details_modal',
    modalInvoice: '#order_invoice_modal',
    closeModal: '[data-modal-close]',

    modalType: '[data-modal-type]',
    modalStatus: '[data-modal-status]',
    modalPlaced: '[data-modal-placed]',
    modalLen: '[data-modal-len]',
    modalCarat: '[data-modal-carat]',
    modalPrice: '[data-modal-price]',
    modalContent: '[data-modal-content]',
    modalNumber: '[data-modal-number]',
    modalBuyer: '[data-modal-buyer]',
    modalAddress: '[data-modal-address]',
    modalAttn: '[data-modal-attn]',
    modalTel: '[data-modal-tel]',

    
    // ? search form
    search: '#orders_search_form',
    searchBody: '#orders-search-body',
    searchTriger: '#orders-search-btn',

});