"use strict";

class SendMessageToManager {
    constructor(kwargs) {

        this.url = kwargs.url || '/mail/to/manager/';

        this.formSelector = kwargs.form || '#form_message';

        this.form = document.querySelector(this.formSelector);
        this.inputs = [...this.form.querySelectorAll('input[type="text"], textarea')];
        this.submit = this.form.querySelector('button[type="submit"]');
        this.close = this.form.querySelector('.btn-close');
        this.alert = document.querySelector('.message_alert');
        this.self_alert = this.form.querySelector('.message_valid');
        this.message = {
            subject: '',
            message: ''      
        };
        
    }

    init() {
        this._submit();
    }
    
    _alert(message, alert_type='info') {
        const alert = `
            <div class="alert alert-${alert_type} mb-4 mt-2 shadow-sm alert-dismissible fade show border-0" role="alert" id="message_alert_info">
                <div class="my-2">
                    <div class="d-flex align-items-center justify-content-center">
                        <i class="fa fa-info me-2 fs-5" aria-hidden="true"></i>
                        <h5 class="h5 m-0 p-0">${message}</h5>
                    </div>
                    <button type="button" class="btn-close shadow-none border-none" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>`;
        return alert;
    }

    _buttonsSwitcher(set = false) {
        switch (set) {
            case false:
                this.submit.classList.remove('active');
                this.submit.removeAttribute('disabled');
                this.close.click();
                break;
            case true:
                this.submit.classList.add('active');
                this.submit.setAttribute('disabled', true);
                break;
        }
    }

    _getData() {

    }

    _submit() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.self_alert.innerHTML = '';
        
            this.inputs.map(inp => {
                if (inp.name == 'subject') {this.message.subject = inp.value;}
                else if (inp.name == 'message') {this.message.message = inp.value;}
            });
            
            if (this.message.subject == '' || this.message.message == '') {
                this.self_alert.insertAdjacentHTML('afterbegin', this._alert('You cannot send an empty message, fill in all the fields', 'danger'));
                
                return this;
            }
            else {
                this._buttonsSwitcher(true);
                ajax(this.url, this.message, this._responce, this);
            }
        });
    }

    _responce(responce, context) {
        setTimeout(() => {
            context._buttonsSwitcher(false);
            context.alert.innerHTML = '';
            context.alert.insertAdjacentHTML('afterbegin', context._alert(responce.message));
 
        }, 200);
    }

    _raise() {

    }

}

// * DOM Content Loaded * //;
document.addEventListener("DOMContentLoaded", () => {
    
    // * -------------------------- show canvas
    const canvasShow = new ElementsControl({
        manager: "#canvas-toggler",
        managed: "#nav-canvas",
    });
    canvasShow.toggler();

    // * -------------------------- hide canvas
    const canvasHide = new ElementsControl({
        manager: "#exit-canvas",
        managed: "#nav-canvas",
    });
    canvasHide.toggler();
        
    // * -------------------------- canvas drop list
    const dropList = new ElementsControl({
        manager: ".canvas__drop-list--trigger",
        managed: ".canvas__drop-list--target",
    });
    dropList.toggler();
    
    
    // * -------------------------- send mial
    const message = new SendMessageToManager({
        form: '#form_message',

    });
    message.init();
    
});

