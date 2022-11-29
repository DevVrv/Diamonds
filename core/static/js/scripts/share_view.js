"user strict";

function view() {

    const elements = document.querySelectorAll('.result__item-list');
    const drop = document.querySelectorAll('.result__drop-down');

    const acordion_btn = document.querySelectorAll('.acordion__btn')
    const acordion = document.querySelectorAll('.acordion__body')

    elements.forEach((elem, index) => {

        elem.addEventListener('click', () => {

            drop[index].classList.toggle('active');

        });

    });

    acordion_btn.forEach((btn, index) => {
        btn.addEventListener('click', () => {

            acordion[index].classList.toggle('active');

        });
    });


}

view();