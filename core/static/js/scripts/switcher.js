"use strict";

function switcher(inputsNames) {
    const inputs = [...document.querySelectorAll(inputsNames)];
    inputs[0].checked = true;
    inputs[0].parentElement.classList.add('active');
    inputs.map((input, index) => {
        input.addEventListener('input', () => {
            
            inputs.map(inp => { inp.checked = false, inp.parentElement.classList.remove('active'); })

            input.checked = true;
            input.parentElement.classList.add('active');

        });
    });
} switcher('.switcher > div > label > input');