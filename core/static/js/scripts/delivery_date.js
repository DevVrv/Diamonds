"use strict";

// @ -------------------------------- DELIVERY DATE
function deliveryDate(action = 'get') {

    // arrs with words of day / month
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Satuday', 'Sunday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // date updater
    Date.prototype.addDays = function(days) {
        const date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    
    // date construcotr
    const  dateObj = new Date();
    
    // --> date update + 15
    const date = dateObj.addDays(15);

    // <-- get day number
    const dayNum = date.getDay();

    // <-- get day
    const day = days[date.getDay()];

    // <-- get month
    const month = months[date.getMonth()];

    if (action == 'get') {
        // return date values
        return {
            day: day,
            month: month,
            dayNum: dayNum
        }
    }
    else if (action == 'set') {
        const deliveryContainer = [...document.querySelectorAll('.delivery_date')];
        deliveryContainer.map(cont => {
            cont.textContent = `${day}, ${month} ${dayNum}`;
        });
    }
}