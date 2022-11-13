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
});