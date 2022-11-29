"use strict";

// @ -------------------------------- SHARE LINK
const kwargs = {
    tigger: '#share-link',
    container: '#share-links-modal',
    exit: '#share-modal-close',
    with: '#share-with-price',
    without: '#share-without-price'
}

class ShareLink {
    constructor(kwargs) {

        // * DOM elements
        this.tigger = this.getElement(kwargs.tigger);
        this.container = this.getElement(kwargs.container);
        this.exit = this.getElement(kwargs.exit, this.container);
        this.with = this.getElement(kwargs.with, this.container);
        this.without = this.getElement(kwargs.without, this.container);
        this.messageBox = this.getElement(kwargs.messageBox, this.container);
        this.shareButtons = [this.with, this.without];
        this.shareText = this.getElement('#messageBox', this.container);

        // * values
        this.key = kwargs.key;
        this.url = kwargs.url;
        this.request = {
            type: '0',
            list: '0'
        };

        console.log(this)
    }

    // * init
    init() {
        this.showHide();
        this.share();
    }
    
    // <-- get element
    getElement(selector, parent = document) {
        return parent.querySelector(selector);
    }

    // * show share
    showHide() {
        this.tigger.addEventListener('click', () => {
            this.container.classList.add('active');
        });
        this.exit.addEventListener('click', () => {
            this.container.classList.remove('active');

            const msg = this.container.querySelector('#share_message');
            if (msg !== undefined && msg !== null) { msg.remove(); }
        });
    }

    // * message
    message(type = 'success') {

        // * make type of message and message text
        let className;
        let messageText;

        if (type == 'success') {
            className = 'text-success';
            messageText = 'The link to the list of products has been copied to the clipboard';
        }
        else if (type == 'danger' || type == 'error') {
            className = 'text-danger';
            messageText = 'Something went wrong';
        }
        else if (type == 'empty' || type == 'error') {
            className = 'text-danger';
            messageText = 'First select the stones you want to share';
        }

        // * create html element
        const html = `
            <h6 class="h6 ${className} m-0 mt-3 text-center" id="share_message">${messageText}</h6>
        `;

        // --> insert message
        const msg = this.container.querySelector('#share_message');
        if (msg == undefined || msg == null) {
            this.messageBox.insertAdjacentHTML('beforeend', html);
        }
        else {
            msg.remove();
            this.messageBox.insertAdjacentHTML('beforeend', html);
        }
    }

    // --> share external link
    share() {
        this.shareButtons.map(button => {

            button.addEventListener('click', () => {

                // * get type of link
                console.log(this)

                // * get diamonds list
                const list = JSON.parse(localStorage.getItem(this.key));
                const diamondsPks = list.map(value => { return value.replace('chb_', ''); });
                
                // * update request list
                this.request.list = diamondsPks;
                if (this.request.list.length == 0) {
                    this.message('empty');
                } else {
                    // --> send request
                    ajax(this.url, this.request, this.shared, this);
                }
                
            });

        }); 
    }
    
    // <-- after share
    shared(responce, context) {

        // <-- get share link
        const shareLink = responce['share_link'];
        
        context.shareText.textContent = shareLink;
        context.shareText.setAttribute('href', shareLink);
        context.shareText.parentElement.classList.add('active');

        // // * copy link
        // navigator.clipboard.writeText(shareLink)
        // .then(() => {
        //     context.message('success');
        // })
        // .catch(err => {
        //     context.message('error');
        // });
       
    }
}