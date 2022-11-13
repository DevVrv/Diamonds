"use strict";
class ElementsControl {
    constructor(params) {
        // @ get elements from DOM
        
        // get parent
        if (params.parent !== undefined && typeof (params.parent) === 'string') {
            this.parent = document.querySelector(params.parent);
        }
        else {
            this.parent = params.parent || document;
        }
        // get manager
        if (typeof (params.manager) === 'string') {
            this.manager = this.parent.querySelectorAll(params.manager);
        }
        else {
            this.manager = params.manager;
        }
        // get managed
        if (typeof (params.managed) === 'string') {
            this.managed = this.parent.querySelectorAll(params.managed);
        }
        else {
            this.managed = params.managed;
        }

        // @ active name
        this.active = params.active || 'active';

        // @ debug
        this.debug = params.debug;
        if (this.debug === true) { this.debuging(); }
    }
    // @ get element
    getElement(selector, parent = document) {
        let items = parent.querySelectorAll(selector);
        return items;
    }

    // @ clear active className -- //
    clearClass(elems, notThis, name = this.active) {
        elems.forEach((elem, i) => {
            if (i !== notThis && elem.classList.contains(name)) {
                elem.classList.remove(name);
            }
        });
    }

    // @ log this -- //
    debuging() {
        console.log(this);
    }

    // -> clean * //
    cleanClass() {
        for (let i = 0; i < this.manager.length; i++) {
            this.manager[i].classList.remove(this.active);
            this.managed[i].classList.remove(this.active);
        }
    }

    // -> drop-down * //
    toggler(params) {

        this.notThis = undefined;
        // notThis
        if (params !== undefined && params.notThis !== undefined) {
            if (typeof (params.notThis) === 'string') {
                this.notThis = this.parent.querySelectorAll(params.notThis);
            }
            else if (typeof (params.notThis) === 'object') {
                this.notThis = params.notThis;
            }
            
        }

        // add click event to managers
        for (let i = 0; i < this.manager.length; i++) {
            this.manager[i].onclick = (e) => {
                // single mod
                if (params !== undefined && params.single === true) {
                    // remove active class
                    this.clearClass(this.manager, i);
                    this.clearClass(this.managed, i);
                }
                // whis notThis
                if (this.notThis !== undefined) {
                    // notThis
                    if (e.target !== this.notThis[i] && e.target.parentElement !== this.notThis[i]) {
                        // toggle active class
                        this.manager[i].classList.toggle(this.active);
                        this.managed[i].classList.toggle(this.active);
                    }
                }
                // whisout notThis
                else {
                    // toggle active class
                    this.manager[i].classList.toggle(this.active);
                    this.managed[i].classList.toggle(this.active);
                }
                // debuging
                if (this.debug === true) { this.debuging(); }
            };
        }

        return this;
    }

    // -> single toggler * //
    singleToggler() {
        for (let i = 0; i < this.manager.length; i++) {
            this.manager[i].addEventListener('click', () => {
                this.manager[i].classList.toggle(this.active);
                if (this.debug === true) {
                    this.debuging();
                }
            });
        }
        return this;
    }

    // -> tabs * //
    switcher() {
        let manager = this.manager[0];
        let row1 = this.managed[0];
        let row2 = this.managed[1];

        manager.onclick = () => {

            if (row1.classList.contains(this.active)) {
                manager.classList.add(this.active);
                row1.classList.remove(this.active);
                row2.classList.add(this.active);
            }
            else if (!row1.classList.contains(this.active)) {
                manager.classList.remove(this.active);
                row1.classList.add(this.active);
                row2.classList.remove(this.active);
            }

        };

        return this;
    }

    // -> jump * //
    jump(pos = 'afterbegin') {
        for (let i = 0; i < this.manager.length; i++) {
            this.managed[0].insertAdjacentElement(pos, this.manager[i]);
        }
    }

    // -> width * //
    screen(func, brace = 768) {
        this.width = document.documentElement.getBoundingClientRect().width;
        
        if (this.width <= brace) {
            func();
        }

        return this;
    }

    // -> width * //
    screen2(func, brace = 768) {
        this.width = document.documentElement.getBoundingClientRect().width;
        
        if (this.width > brace) {
            func;
        }

        return this;
    }

    // -> label
    label(checked = Function, unchecked = Function) {
        
        for (let i = 0; i < this.manager.length; i++) {
            // ? add event Listener
            this.manager[i].onclick = () => {
                // if checked = false
                if (this.managed[i].checked) {
                    // * set input value
                    this.managed[i].checked = false;
                    // * add active class name
                    this.manager[i].classList.toggle(this.active);

                    // * input name
                    const name = this.managed[i].getAttribute('name');
                    if (unchecked) {
                        unchecked(name);
                    }
                }
                // if checked = true
                else if (!this.managed[i].checked) {
                    // * set input value
                    this.managed[i].checked = true;
                    // * add active class name
                    this.manager[i].classList.toggle(this.active);
                    
                    // * input name
                    const value = this.managed[i].getAttribute('name');
                    if (checked) {
                        checked(value);
                    }
                }
                // debuging
                if (this.debug === true) {
                    this.debuging();
                }
                // return value
                return this;
            }
        }
    }

    // -> double toggler * //
    sort(name1 = 'active-1', name2 = 'active-2') {
        for (let i = 0; i < this.manager.length; i++) {
            // add event
            this.manager[i].addEventListener('click', () => {
                // clear class name from enother sort items
                this.clearClass(this.manager, i, name1);
                this.clearClass(this.manager, i, name2);

                // toggle class name for sort item
                if (!this.manager[i].classList.contains(name1) && !this.manager[i].classList.contains(name2)) {
                    this.manager[i].classList.add(name1);
                }
                else if (this.manager[i].classList.contains(name1)) {
                    this.manager[i].classList.remove(name1);
                    this.manager[i].classList.add(name2);
                }
                else if (this.manager[i].classList.contains(name2)) {
                    this.manager[i].classList.remove(name2);
                }

            });

        }
    }
}
