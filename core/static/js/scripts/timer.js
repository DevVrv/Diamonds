"use strict";

function timer(containerID, clockID, link, timer = 60) {

    // -- button HTML
    const buttonHTML = 
    `
        <div class="login__info w-100 d-flex align-items-center justify-content-between py-3">
            <span>Didn't get the code ?</span>
            <a href="${link}" class="btn btn-secondary" id="resend_mail_code">Send the code again</a>
        </div>
    `;
    
    // -- get container + get clock
    const container = document.querySelector(containerID);
    let clock = null;
    if (container !== undefined) {
        clock = container.querySelector(clockID);
    }

    // -- get now time
    const time = Number(Date.now());

    // -- create storage
    if (localStorage.getItem('timer') === null) {
        localStorage.setItem('timer', time);
    }

    //  -- update clock
    function updateClock() {

        // -- get date time now
        const timeNow = Number(Date.now());
        const timeFromStorage = Number(localStorage.getItem('timer'));

        // -- get difference
        let difference = Math.floor((timeNow / 1000) - (timeFromStorage / 1000));

        // -- check difference
        if (difference >= timer) {
            
            // -- clear storage
            localStorage.clear();

            // -- get clock parent + remove
            let clockParent = clock.parentElement;
            clockParent.remove();

            // -- add button
            container.innerHTML = buttonHTML;

        }
        else {
            // -- set timer text content
            clock.textContent = timer - difference;
        }

    }

    if (clock !== null) {
        let timerID = setInterval(updateClock, 1000);
    }

}

timer('#resend_timer_container', '#resend_timer', '/user/confirm/again/');