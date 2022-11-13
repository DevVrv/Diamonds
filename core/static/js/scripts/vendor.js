"use strict";

class Vendor {
    constructor(kwargs) {
        this.form = this.getElement(kwargs.form);

        if (kwargs.debug == true) { this.debug(); }
        this.init();
    }

    init() { 
        this.submit('/vendor/white_ajax/');
    }
    debug(info = this) {
        console.log(info);
        return this;
    }
    getElement(selector, parent = document) {
        return parent.querySelector(selector);
    }
    submit(url) {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log(111)
            const formData = new FormData(this.form);
            this.request(url, formData);
        });
    }
    request(url, data) {
        async function req(url, data) {
            // * create responce data var
            let responceData = null;
            // <-- get crsf token
            function getToken(name) {
                let cookieValue = null;
                if (document.cookie && document.cookie !== '') {
                    const cookies = document.cookie.split(';');
                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i].trim();
                        // Does this cookie string begin with the name we want?
                        if (cookie.substring(0, name.length + 1) === (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }

            // --> create ajex request
            const responce = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'form/multipart',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getToken('csrftoken'),
                },
                body: data

            }).then(responce => { // * return responce
                return responce.json();
            }).then(data => {
                // get responce datashare.html
                responceData = data;

            }).catch(() => {
                console.log('error');
            });

            // <-- return responce data
            return responceData;
        }
        return req(url, data);
    }
}

const sendFile = new Vendor({
    form: '#upload_white',
    debug: true
}); 