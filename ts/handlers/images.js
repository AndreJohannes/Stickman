/// <reference path="../sticky.ts" />
var ImageHandler = (function () {
    function ImageHandler(controller) {
        this.controller = controller;
        this.$images = $("#images");
        this.update();
    }
    ImageHandler.prototype.update = function () {
        var project = this.controller.getProject();
        this.$images.empty();
        for (var _i = 0, _a = project.getImages(); _i < _a.length; _i++) {
            var image = _a[_i];
            var $img = $("<img>");
            $img.attr("src", image);
            $img.click(function () { $("#cropImageModal .modal-body").append($img); $("#cropImageModal")["modal"]("show"); });
            this.$images.append($img);
        }
    };
    return ImageHandler;
}());
