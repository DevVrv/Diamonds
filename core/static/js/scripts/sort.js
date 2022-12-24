'use strict';

class Sort {
    constructor(kwargs) {

        // create obj
        this.simple = {};
        this.advenced = {};
        this.sort = [];
        this.key = kwargs.key || 'result';
        this.make = kwargs.make;
        
        // extentions objects
        this.dataControl = kwargs.dataControl;
        this.view = kwargs.view;

        this.container = this._getElems(kwargs.container)[0];
        
        // simple 
        this.simple.container = this._getElems(kwargs.simpleContainer, document);
        this.simple.elems = this._getElems('[data-sort-simple]', this.simple.container[0]);

        // advenced
        this.advenced.container = this._getElems(kwargs.advancedContainer);
        this.advenced.elems = this._getElems('[data-sort-advenced]', this.advenced.container[0]);

        this.advenced.priority = this._getElems('[data-sort-priority]', this.advenced.container[0]);
        this.advenced.by = this._getElems('[data-sort-by]', this.advenced.container[0]);
        this.advenced.plus = this._getElems('.fa-plus', this.advenced.container[0]);
        this.advenced.angle = this._getElems('.fa-angle-down', this.advenced.container[0]);
 
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
    _dragInit() {
        this.sortable = new Sortable(this.advenced.priority[0], {
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
                                    <span>Girdle: ${diamond.fields.girdle}</span>
                                </li>
                                <li class="result__drop-li">
                                    <span>Report №: ${diamond.fields.stock}</span>
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
    _getByData(value = '', key = 'simple' || 'advenced') {
        let elems;
        if (key == 'simple') {
            elems = this.simple.elems;
            elems = elems.filter(elem => {if (elem.dataset.sortSimple == value) {return elem;}});
        }
        else if (key == 'advenced') {
            elems = this.advenced.elems;
            elems = elems.filter(elem => {if (elem.dataset.sortAdvenced == value) {return elem;}});
        }
        
        return elems[0];
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
            this.advenced.by[0].insertAdjacentElement('afterbegin', element);
        }
        else if (mode == 'priority') {
            this.advenced.priority[0].insertAdjacentElement('afterbegin', element);
        }
    }
    _updateSort() {
        // create sort direction
        this.sort = [];
        const elems = this._getElems('[data-sort-advenced]', this.advenced.priority);
        elems.map(elem => {
            let key = elem.dataset.sortAdvenced;
            const direction = elem.dataset.sortDirection;
            if (direction == 'down') {
                key = `-${key}`
            }
            this.sort.push(key);
        });
        this.makeSort();
    }


    // --> Events
    _dragListener() {
        this.advenced.dragElems = this._getElems('[data-sort-advenced]', this.advenced.priority);
        this.advenced.dragElems.map(elem => {
            elem.ondragend = (e) => {
                const target = e.target;
                if (target === elem) {
                    this._updateSort();
                }
            };
        });
    }
    _plusListener() {
        this.advenced.plus.map(p => {
            p.addEventListener('click', () => {
                const advanceElem = p.parentElement.parentElement;
                const simpleElem = this._getByData(advanceElem.dataset.sortAdvenced, 'simple');
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
        this.advenced.angle.map(a => {
            a.addEventListener('click', () => {
                const advanceElem = a.parentElement.parentElement;
                const simpleElem = this._getByData(advanceElem.dataset.sortAdvenced, 'simple');
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
                const advanceElem = this._getByData(simpleElem.dataset.sortSimple, 'advenced');
                const direction = simpleElem.dataset.sortDirection;
                
                // clean simple
                this._simpleCleane();
                
                // set active
                simpleElem.classList.add('active');
                advanceElem.classList.add('active');
                
                // change direction
                this._changeDirection(simpleElem, advanceElem, direction);

                // jump advenced
                this._jumpAdvanced(advanceElem, 'priority');

                // update sort object
                this._dragListener();
                this._updateSort();
            });
        });
    }


    // --> sorting
    makeSort() {
        // compare 
        if (this.sort[0] == 'compare' || this.sort[0] == '-compare') {
            const compare = this.sort[0];
            this.dataControl.sort.compare[this.key] = compare;
            this.sort = this.sort.filter(v => { return v != compare; });
        }
        else {
            this.dataControl.sort.compare[this.key] = false;
        }

        // sort data 
        this.dataControl.sort[this.key] = this.sort;

        // --> clean html + insert spiner
        this.container.innerHTML = '';
        this.container.insertAdjacentHTML('afterbegin', this.spinerView('get'));

        //  @ lock scroll
        this.dataControl.scrollLock = true;

        // @ drop infinity data
        this.dataControl.dropInfinity();

        // --> send ajax
        ajax('filtering/', this.dataControl, this.updateViewStart, this);
    }
    updateViewStart(responce, context) {
        let diamonds;
        if (context.key !== 'comparison') {
            diamonds = JSON.parse(responce[context.key]);
        }
        else {
            diamonds = responce;
        }

        // -- responce reverse
        if (context.responceReverse !== undefined && context.responceReverse !== null && context.responceReverse == true) {
            diamonds = diamonds.reverse();
        }

        // --> update diamonds view
        setTimeout(() => {
            context.spinerView('remove', context.container);
            diamonds.map(diamond => {
                context.container.insertAdjacentHTML('beforeend', context.getDiamondHTML(diamond));
            });

            context.updateViewEnd(responce);
        }, 200);
    }
    updateViewEnd(responce) {

        // <-- get max order
        const resultLen = responce.resultResponceLen;
        const bestLen = responce.bestResponceLen;

        // --> add abilitys
        console.log(this)

        this.dataControl.selected();
        this.dataControl.selecteble();

        // -- update max order len
        this.dataControl.maxOrder.result = resultLen;
        this.dataControl.maxOrder.best = bestLen;

        //  @ unlock scroll
        this.dataControl.scrollLock = false;
    }
    
}
