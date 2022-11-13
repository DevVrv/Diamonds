"use strict";

function inDev(togglerName, modalID) {
    // active name
    let active = 'active';

    // items
    const toggler = document.querySelectorAll(togglerName);
    const modal = document.querySelector(modalID);
    
    // create event
    toggler.forEach(elem => {
        elem.addEventListener('click', (e) => {
            e.preventDefault;
            // animation event

            // show modal
            modal.classList.add(active);

            let timerID = setTimeout(() => {
                modal.classList.remove(active);
            }, 2000); 
        });

    });
}

inDev('.in-dev-toggler', '#in-dev');