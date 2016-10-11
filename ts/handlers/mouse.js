/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../renderer.ts" />
var MouseHandler = (function () {
    function MouseHandler(renderer) {
        this.$canvas = $(renderer.getDom());
        this.$canvas.on("contextmenu", function () {
            console.log("haha");
        });
    }
    return MouseHandler;
}());
