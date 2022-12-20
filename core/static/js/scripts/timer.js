"use strict";

function timer(timerContainer = '#resend_timer_container', timerSelector='#resend_timer', resend_link=String) {

    // resend button
    const resendButton = `
        <div class="login__info w-100 d-flex align-items-center justify-content-between py-3">
            <span>Didn't get the code ?</span>
            <a href="${resend_link}" class="btn btn-secondary" id="resend_mail_code">Send the code again</a>
        </div>
    `;
    
    // timer params
    const timer_container = document.querySelector(timerContainer);
    const timer_element = timer_container.querySelector(timerSelector);
    if (timer_element) {
        const timer_parent = timer_element.parentElement;
        let timer_value = Number(timer_element.textContent);
        
        const timerId = setInterval(() => {
            if (timer_value > 0) {
                timer_element.textContent = timer_value -= 1;
            } else {
                if (timer_parent) {
                    timer_container.insertAdjacentHTML('beforebegin', resendButton);
                    timer_parent.remove();
                    clearInterval(timerId)
                }
            }
        }, 1000)
    }

}