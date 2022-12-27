"use strict";

function getDiamondHTML(diamond) {

    // * shape list
    const shapeList = ['Round', 'Marquise', 'Asscher', 'Cushion', 'Emerald', 'Heart', 'Oval', 'Pear', 'Princess', 'Radiant', 'Another'];

    // * get delivery date
    const delivery = deliveryDate('get');

    // * create path for photo
    let photo = '/static/img/diamonds/base-diamond.jpg';
    if (diamond.fields.photo !== 'N/A' && diamond.fields.photo !== '') {
        photo = diamond.fields.photo;
    }
    
    // * get shape icon key
    let shape = diamond.fields.shape;
    let shapeValue = shapeList.filter(value => { return value == shape });
    if (shapeValue.length == 0) {
        shapeValue = 'Round'
    }

    // * diamond html text
    const diamondHTML = `
    <div class="result__item result-section--element" data-io-diamond="comparison"
    data-io-copy="to-comparison">
        <ul class="item-list result__item-list">
            <li class="item-list-element">
                <i class="item-shape svg-${shapeValue[0].toLowerCase()}"></i>
                <i class="fa fa-video-camera ms-2" aria-hidden="true"></i>
                <i class="fa fa-chevron-down ms-2" aria-hidden="true"></i>
            </li>
            <li class="item-list-element">
                <div class="checkbox-label label-result" data-io-label="diamonds-item">
                    <input type="checkbox" name="chb_${diamond.pk}" id="chb_${diamond.pk}" class="d-none checkbox checkbox-results">
                    <i class="fa fa-check" aria-hidden="true"></i>
                </div>
            </li>
            <li class="item-list-element">
                <span class="me-2 shape-text-info">Shape:</span>
                <span>${diamond.fields.shape}</span>
            </li>
            <li class="item-list-element">
                <span class="item-list-element--info">Disc%:</span>
                <span>${diamond.fields.rap_disc}%</span>
            </li>
            <li class="item-list-element">
                <span class="item-list-element--info">Price:</span>
                <span>$${diamond.fields.sale_price}</span>
            </li>
            <li class="item-list-element">
                <span class="item-list-element--info">Carat:</span>
                <span>${diamond.fields.weight}</span>
            </li>
            <li class="item-list-element">
                <span class="item-list-element--info">Cut:</span>
                <span>${diamond.fields.cut}</span>
            </li>
            <li class="item-list-element">
                <span class="item-list-element--info">Color:</span>
                <span>${diamond.fields.color}</span>
            </li>
            <li class="item-list-element">
                <span class="item-list-element--info">Clarity:</span>
                <span>${diamond.fields.clarity}</span>
            </li>
            <li class="item-list-element">
                <span class="item-list-element--info">T%:</span>
                <span>${diamond.fields.table_procent}%</span>
            </li>
            <li class="item-list-element">
                <span class="item-list-element--info">D%:</span>
                <span>${diamond.fields.depth_procent}%</span>
            </li>
            <li class="item-list-element">
                <span class="item-list-element--info">L/W:</span>
                <span>${diamond.fields.lw}</span>
            </li>
            <li class="item-list-element">
                <span class="item-list-element--info">Report:</span>
                <span>${diamond.fields.lab}</span>
            </li>
        </ul>
        <div class="result__drop-down border-top">
            <div class="row">
                <div class="result__drop-down--col col-3">
                    <img src="${photo}" alt="" class="img-fluid rounded">
                </div>
                <div class="result__drop-down--col col-7">

                    <h4 class="h4 py-2">${diamond.fields.weight} Carat Pear Lab Diamond</h4>

                    <h5 class="h5 py-2">$${diamond.fields.sale_price}</h5>

                    <ul class="list result__info-list">

                        <li class="py-3 border-bottom result__info-li">
                            <span>Carat: ${diamond.fields.weight}</span>
                        </li>
                        <li class="py-3 border-bottom result__info-li">
                            <span>Color: ${diamond.fields.color}</span>
                        </li>
                        <li class="py-3 border-bottom result__info-li">
                            <span>Clarity: ${diamond.fields.clarity}</span>
                        </li>
                        <li class="py-3 border-bottom result__info-li">
                            <span>Cut: ${diamond.fields.cut}</span>
                        </li>
                        <li class="py-3 border-bottom result__info-li">
                            <span>Polish: ${diamond.fields.polish}</span>
                        </li>
                        <li class="py-3 border-bottom result__info-li">
                            <span>Symmetry: ${diamond.fields.symmetry}</span>
                        </li>
                        <li class="py-3 border-bottom result__info-li">
                            <span>Table: ${diamond.fields.table_procent}%</span>
                        </li>
                        <li class="py-3 border-bottom result__info-li">
                            <span>Depth: ${diamond.fields.depth_procent}%</span>
                        </li>
                        <li class="py-3 border-bottom result__info-li">
                            <span>L/W: ${diamond.fields.lw}</span>
                        </li>
                        <li class="py-3 border-bottom result__info-li">
                            <span>Measurements: ${diamond.fields.measurements}</span>
                        </li>
                    </ul>

                    <div class="acordion">
                        <button type="button" class="acordion__btn btn-more--info">
                            Additional Details
                            <i class="fa fa-chevron-down ms-2" aria-hidden="true"></i>
                        </button>
                        <div class="acordion__body body-more--info border-top w-100">
                            <ul class="list result__drop-list">
                                <li class="result__drop-li">
                                    <span>Culet: ${diamond.fields.culet}</span>
                                </li>
                                <li class="result__drop-li">
                                    <span>Gridle: Thick - ${diamond.fields.girdle}</span>
                                </li>
                                <li class="result__drop-li">
                                    <span>Report №: ${diamond.fields.lab}</span>
                                </li>
                                <li class="result__drop-li">
                                    <span>Fluor: ${diamond.fields.fluor}</span>
                                </li>
                                <li class="result__drop-li">
                                    <span>Origin: Lab grown Diamond</span>
                                </li>
                                <li class="result__drop-li">
                                    <span class="d-flex w-100 flex-column">
                                        <span>Lab Created Diamond Delivery:</span>
                                        <span class="text-nowrap delivery_date">${delivery.day}, ${delivery.month} ${delivery.dayNum}</span>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
                <div
                    class="result__drop-down--col col-2 d-flex flex-column justify-content-center align-items-center">
                    <p class="mt-3 w-100 d-flex justify-content-center">
                        <i class="fa fa-heart me-2 text-primary" aria-hidden="true"></i>
                        <span>Only One Available</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
    `;
    
    return diamondHTML;
    
}