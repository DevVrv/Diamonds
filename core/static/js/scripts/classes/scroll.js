"use strict";

class ScrollFix {

    constructor(kwargs) {
        // ? scroll container
        this.container = this.getElement(kwargs.container);

        // 
        this.extensionBottom = kwargs.extensionBottom; 
        this.extensionTop = kwargs.extensionTop; 

        // -- debug
        this.debug = kwargs.debug;
        // -- create
        this.create();
    }
    // @ create functions
    create() {
        // ? debug
        if (this.debug === true) {
            this.debuger();
        }
        // ? scroll
        this.scroll();
    }
    // @ debug method
    debuger(info = this) {
        console.log(info);
    }
    // @ get element
    getElement(selector, parent = document) {
        // get element from DOM
        let element = parent.querySelectorAll(selector);
        if (element.length === 1) {
            element = element[0];
        }
        // return element
        return element;
    }

    // --> scroll
    scroll() {

        this.container.scrollTo(0, 4);
        // add scroll event
        this.container.addEventListener('scroll', () => {
            // get scroll height
            this.scrollHeight = this.container.scrollHeight;
            this.scrollTop = this.container.scrollTop;
            this.scrollBottom = this.container.scrollHeight - this.container.scrollTop - this.container.clientHeight;

            // scroll bottom
            if (this.scrollBottom < 4) {

                this.container.scrollTo({
                    top: this.scrollTop - 5,
                    behavior: 'smooth'
                });

                // --> extentsion
                if (this.extensionBottom !== undefined) {
                    this.extensionBottom();
                }
            }
            
            // scroll bottom
            if (this.scrollTop < 4) {
                this.container.scrollTo({
                    top: 5,
                    behavior: 'smooth'
                });

                // --> extentsion
                if (this.extensionTop !== undefined) {
                    this.extensionTop();
                }
            }
        });
    }
}

function windowScrollFix() {

    window.scrollTo({
        top: 5,
        behavior: 'smooth'
    });

    window.addEventListener('scroll', () => {

        // let scrollHeight = document.documentElement.scrollHeight;
        let scrollTop = document.documentElement.scrollTop;
        let scrollBottom = document.documentElement.scrollHeight - document.documentElement.scrollTop - document.documentElement.clientHeight;

        if (scrollBottom < 4) {
            window.scrollTo({
                top: scrollTop - 5,
                behavior: 'smooth'
            });
        }

        if (scrollTop < 4) {
            window.scrollTo({
                top: 5,
                behavior: 'smooth'
            });
        }
    });

} windowScrollFix();