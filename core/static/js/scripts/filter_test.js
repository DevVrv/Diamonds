"user strict";


class Control {
    
    _debug(log = this) {
        console.log(log);
    }

    _getElems(selectror = String, parent = document) {
        if (parent == document) {
            return [...parent.querySelectorAll(selectror)];
        }
        else if (parent.length != undefined) {
            let nodes = [];
            parent.map(elem => {
                nodes = [...nodes, ...[...parent.querySelectorAll(selectror)]];
            });
        }
    }

}

class Filter extends Control {
    constructor(kwargs) {
        super();

        if (kwargs.debug) {
            this._debug();
        }
    }
}

// @ NoUI
class NoUI extends Control {

    constructor(kwargs) {
        super()

        this.default_strs = {};
        this.active_size = 768;
        this.active_button = this._getElement('#show_filter_result');
        this.filter_exit = this._getElement('#filter-exit-btn');

        this.data = {
            shape: [],
            lab: [],
            strs: {},
            nums: {}
        }
        this.dataControl = kwargs.dataControl;
        this.view = kwargs.view;
        this.url = kwargs.url;
        this.keys = [];

        // <-- Main Elements list
        this.parent = this._getElement(kwargs.parent);
        this.numericElements = this._getElements(kwargs.numericSliders, this.parent);
        this.strElements = this._getElements(kwargs.stringSliders, this.parent);
        this.labElements = this._getElements(kwargs.labInputs, this.parent);
        this.shapeElements = this._getElements(kwargs.shapeInputs, this.parent);
        this.cleanButton = this._getElement(kwargs.cleanButton, this.parent);
        this.numericInputs = [];

        // -- params
        this.sliders = [];

        // -- clean
        this.clean();
    }

    // <-- get max min values
    getMaxMin(selector) {
        const input = this._getElement(selector);
        const values = {
            max: Number(input.max),
            min: Number(input.min)
        }
        return values;
    }

    // -- create numeric sliders
    numeric(slider, settings) {

        // keys update
        const key = settings.options.key;
        this.keys.push(key);

        // get slider element and parent
        const sliderElement = this._getElement(slider);
        const parent = sliderElement.closest('.filter-item');

        // slider create + update sliders list
        const sliderObj = noUiSlider.create(sliderElement, settings.params);
        this.sliders.push(sliderObj)

        // -- get numeric input
        this.numericInputs[key] = {
            min: this._getElement('[data-numeric-input="min"]', parent),
            max: this._getElement('[data-numeric-input="max"]', parent)
        };
        
        // -- update numeric inputs
        sliderObj.on('update', () => {
            // <-- get value from slider
            const value = sliderObj.get();

            // -- set value in input
            this.numericInputs[key]['min'].value = value[0];
            this.numericInputs[key]['max'].value = value[1];

            // <-- get current min max value
            let currentMin = value[0];
            let currentMax = value[1];
            if (key == 'sale_price') {
                currentMin = currentMin.slice(0, currentMin.length -1);
                currentMax = currentMax.slice(0, currentMax.length - 1);
            }
            
            // <-- get default min max value
            const defaultMin = sliderObj.options.start[0]
            const defaultMax = sliderObj.options.start[1]

            // -- check differences and update nums data
            if (currentMin == defaultMin && currentMax == defaultMax) {
                delete (this.data.nums[key]);
            } else {
                this.data.nums[key] = [currentMin, currentMax];
            }
        });

        // -- input changers
        this.numericInputs[key]['min'].addEventListener('change', () => {
            sliderObj.set([this.numericInputs[key]['min'].value, null]);
            // --> apply changes
            this.apply();
        });
        this.numericInputs[key]['max'].addEventListener('change', () => {
            sliderObj.set([null, this.numericInputs[key]['max'].value]);
            // --> apply changes
            this.apply();
        });

        // --> apply changes
        sliderObj.on('change', () => {
            // --> apply changes
            this.apply();
        });

    }

    // -- create string sliders
    string(slider, settings) {

        // -- keys update
        const key = settings.options.key;
        this.keys.push(key);

        // <-- get slider element and parent
        const sliderElement = this._getElement(slider);
        const parent = sliderElement.closest('.filter-item');

        // -- slider create + update sliders list
        const sliderObj = noUiSlider.create(sliderElement, settings.params);
        this.sliders.push(sliderObj)

        // -- pips settings
        const pips = this._getElements('.noUi-value', parent);
        this.default_strs[key] = settings.params.replacePips;
        pips.map((pip, index) => {
            pip.textContent = settings.params.replacePips[index];
        });

        sliderObj.on('change', () => {
            
            // <-- get slider values
            const start = sliderObj.get()[0];
            const end = sliderObj.get()[1];
            const names = sliderObj.options.replacePips;

            const current_values = names.filter((name, index) => {
                if (index >= start - 1 && index <= end - 1) {
                    return name;
                }
            });

            this.data.strs[key] = current_values;
            if (this.data.strs[key].length == this.default_strs[key].length) {
                delete this.data.strs[key];
            }
            
            this.apply();
        });
    }

    // -- create select input
    select(key) {

        // -- get inputs list
        let inputs;
        if (key === 'lab') {
            inputs = this.labElements;
        }
        else if (key === 'shape') {
            inputs = this.shapeElements;
        }

        // -- listen inputs
        inputs.map(input => {
            input.addEventListener('change', () => {
                const value = Number(input.value),
                    checked = input.checked,
                    shape = input.dataset.shape;
                // -- checked true
                if (checked) {
                    if (key == 'shape') {
                        this.data[key].push(shape);
                    }
                    else if (key == 'lab') {
                        this.data[key].push(input.dataset.labName);
                    }
                }
                // -- checked false
                else if (!checked) {
                    if (key == 'shape') {
                        this.data[key] = this.data[key].filter(v => { return v != shape; });
                    }
                    else if (key == 'lab') {
                        this.data[key] = this.data[key].filter(v => { return v != input.dataset.labName; });
                    }
                }

                this.apply();
            });
        });
    }

    // -- clean
    clean() {
        this.cleanButton.addEventListener('click', () => {
            // -- set data default
            this.data = {
                shape: [],
                lab: [],
                strs: {},
                nums: {}
            }

            // -- set sliders default
            this.sliders.map(slider => {
                slider.reset();
            });

            // -- set shape default
            this.shapeElements.map(shape => {
                shape.checked = false;
            });

            // -- set lab default
            this.labElements.map(shape => {
                shape.checked = false;
            });

            this.apply();

            // -- hide clean button
            this.cleaner();
        });
    }

    // -- cleaner
    cleaner() {
        if (Object.keys(this.data.nums).length === 0 && Object.keys(this.data.strs).length === 0 && this.data.lab.length === 0 && this.data.shape.length == 0) {
            this.cleanButton.classList.add('hidden');
            this.cleanButton.setAttribute('disabled', '');
        }
        else {
            this.cleanButton.classList.remove('hidden');
            this.cleanButton.removeAttribute('disabled');
        }
    }
    
    // --> apply data
    apply() {
        this.cleaner();

        // -- set keys
        this.currentKey = 'all';
        this.dataControl.currentKey = 'all';

        // -- set ordering default
        this.dataControl.ordering = {
            result: [0, 45],
            best: [0, 45]
        }
        this.dataControl.requestOrdering = {
            result: [0, 45],
            best: [0, 45],
        }

        // --> clean containers view and add spiner
        this.view.result.container.innerHTML = '';
        this.view.result.container.insertAdjacentHTML('afterbegin', this.spinerView('get'));

        this.view.best.container.innerHTML = '';
        this.view.best.container.insertAdjacentHTML('afterbegin', this.spinerView('get'));

        // --> update data control
        for (let key in this.data) {
            this.dataControl.filter[key] = this.data[key];
        }

        // @ drop infinity data
        this.dataControl.dropInfinity();

        const window_size = document.documentElement.getBoundingClientRect().width;
        
        if (window_size > this.active_size) {
            // --> send request
            ajax('filtering/', this.dataControl, this.view.updateView, this.view);
        }
        else {
            this.active_button.classList.add('active');
            this.active_button.onclick = () => {
                // --> send request
                ajax('filtering/', this.dataControl, this.view.updateView, this.view);
                this.active_button.classList.remove('active');
                this.filter_exit.click();
            }
        }
    }
}



document.addEventListener('DOMContentLoaded', () => {

    const filter = new Filter({
        debug: true
    });

    // -- Filter NoUI -- //
    function filterNoUI() {
        // -- create NoUI Constructor
        const noUIKwargs = {
            parent: '.diamonds-filter-container',
            numericSliders: '[data-slider-type="numeric"]',
            stringSliders: '[data-slider-type="string"]',
            shapeInputs: '[data-slider-type="shape"]',
            labInputs: '[data-slider-type="lab"]',
            cleanButton: '#reset-filter',
            dataControl: dataControl,
            view: comparison,
            url: 'filtering/',
        }
        const noUI = new NoUI(noUIKwargs);
        
        // -- create sale price
        const price_values = noUI.getMaxMin('#range_price');
        const priceNoUI = noUI.numeric('[data-slider="price"]', {
            params: {
                start: [price_values.min, price_values.max],
                connect: true,
                step: 1,
                tooltips: true,
                range: {
                    min: price_values.min,
                    max: price_values.max,
                },
                format: {
                    to: function (value) {
                        return parseInt(value) + "$";
                    },
                    from: function (value) {
                        return parseInt(value);
                    },
                },
            },
            options: {
                key: 'sale_price'
            }
        });
        
        // -- create carat
        const carat_values = noUI.getMaxMin('#range_carat');
        const caratNoUI = noUI.numeric('[data-slider="carat"]', {
            params: {
                start: [carat_values.min, carat_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: carat_values.min,
                    max: carat_values.max,
                },
            },
            options: {
                key: 'weight'
            },
        });
        
        // -- create lw
        const lw_values = noUI.getMaxMin('#range_lw');
        const lwNoUI = noUI.numeric('[data-slider="lw"]', {
            params: {
                start: [lw_values.min, lw_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: lw_values.min,
                    max: lw_values.max,
                },
            },
            options: {
                key: 'lw'
            }
        });
        
        // -- create table
        const table_values = noUI.getMaxMin('#range_table');
        const tableNoUI = noUI.numeric('[data-slider="table"]', {
            params: {
                start: [table_values.min, table_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: table_values.min,
                    max: table_values.max,
                },
            },
            options: {
                key: 'table_procent'
            }
        });
        
        // -- create length
        const length_values = noUI.getMaxMin('#range_length_mm');
        const lengthNoUI = noUI.numeric('[data-slider="length"]', {
            params: {
                start: [length_values.min, length_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: length_values.min,
                    max: length_values.max,
                },
            },
            options: {
                key: 'length_mm'
            }

        });
        
        // -- create depth
        const dapth_values = noUI.getMaxMin('#range_depth');
        const dapthNoUI = noUI.numeric('[data-slider="depth"]', {
            params: {
                start: [dapth_values.min, dapth_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: dapth_values.min,
                    max: dapth_values.max,
                },
            },
            options: {
                key: 'depth'
            }
        });

        // -- create depth procent
        const depth_procent__values = noUI.getMaxMin('#range_depth_procent');
        const dapth_procent_NoUI = noUI.numeric('[data-slider="depth_procent"]', {
            params: {
                start: [depth_procent__values.min, depth_procent__values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: depth_procent__values.min,
                    max: depth_procent__values.max,
                },
            },
            options: {
                key: 'depth_procent'
            }
        });
        
        // -- create width
        const width_values = noUI.getMaxMin('#range_width');
        const widthNoUI = noUI.numeric('[data-slider="width"]', {
            params: {
                start: [width_values.min, width_values.max],
                connect: true,
                step: 0.01,
                tooltips: true,
                range: {
                    min: width_values.min,
                    max: width_values.max,
                },
            },
            options: {
                key: 'width'
            }
        });

        // -- cut create
        const cutNoUI = noUI.string('[data-slider="cut"]', {
            params: {
                start: [1, 5],
                connect: true,
                step: 1,
                range: {
                    min: 1,
                    max: 5,
                },
                pips: {
                    mode: "positions",
                    values: [1, 25, 50, 75, 96],
                    density: 1,
                    steped: true,
                },
                replacePips: ["Fair", "Good", "Very Good", "Excellent", "Ideal"]
            },
            options: {
                key: 'cut'
            },
        });

        // -- color create
        const colorNoUI = noUI.string('[data-slider="color"]', {
            params: {
                start: [1, 10],
                connect: true,
                step: 1,
                range: {
                    min: 1,
                    max: 10,
                },
                pips: {
                    mode: "count",
                    values: 10,
                    density: 1,
                },
                replacePips: ["M", "L", "K", "J", "I", "H", "G", "F", "E", "D"],
            },
            options: {
                key: 'color'
            },
        });

        // -- clarity create
        const clarityNoUI = noUI.string('[data-slider="clarity"]', {
            params: {
                start: [1, 10],
                connect: true,
                step: 1,
                range: {
                    min: 1,
                    max: 10,
                },
                pips: {
                    mode: "count",
                    values: 10,
                    density: 1,
                },
                replacePips: ["I2", "I1", "SI2", "SI1", "VS2", "VS1", "VVS2", "VVS1", "IF", "FI",],
            },
            options: {
                key: 'clarity'
            },
        });

        // -- clarity create
        const polishNoUI = noUI.string('[data-slider="polish"]', {
            params: {
                start: [1, 3],
                connect: true,
                step: 1,
                range: {
                    min: 1,
                    max: 3,
                },
                pips: {
                    mode: "count",
                    values: 3,
                    density: 1,
                },
                replacePips: ["Good", "Very Good", "Excellent"],
            },
            options: {
                key: 'polish'
            },
        });

        // -- symmetry create
        const symmetryNoUI = noUI.string('[data-slider="symmetry"]', {
            params: {
                start: [1, 3],
                connect: true,
                step: 1,
                range: {
                    min: 1,
                    max: 3,
                },
                pips: {
                    mode: "count",
                    values: 3,
                    density: 1,
                },
                replacePips: ["Good", "Very Good", "Excellent"],
            },
            options: {
                key: 'symmetry'
            },
        });

        // -- fluour create
        const fluourNoUI = noUI.string('[data-slider="fluour"]', {
            params: {
                start: [1, 5],
                connect: true,
                step: 1,
                range: {
                    min: 1,
                    max: 5,
                },
                pips: {
                    mode: "count",
                    values: 5,
                    density: 1,
                },
                replacePips: ["None", "Faint", "Medium", "Strong", "Very Strong"],
            },
            options: {
                key: 'fluor'
            },
        });

        // -- selectebel inputs create
        const shapeNoUI = noUI.select('shape');
        const labNoUI = noUI.select('lab');
    } filterNoUI();

});