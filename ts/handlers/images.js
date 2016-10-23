/// <reference path="../sticky.ts" />
var ImageHandler = (function () {
    function ImageHandler(controller) {
        this.controller = controller;
        this.$images = $("#images");
        this.update();
    }
    ImageHandler.prototype.update = function () {
        var that = this;
        var project = this.controller.getProject();
        this.$images.empty();
        var images = project.getImages();
        for (var key in images) {
            var uuid = key;
            var $img = $("<img>");
            $img.attr("src", images[uuid]);
            $img.data("uuid", uuid);
            $img.click(this.cropAndSelect($img, uuid));
            this.$images.append($img);
        }
    };
    ImageHandler.prototype.cropAndSelect = function ($img, uuid) {
        var that = this;
        var project = this.controller.getProject();
        return function () {
            var $img_clone = $img.clone();
            $("#cropImageModal .modal-body").empty().append($img_clone);
            $("#cropImageModal")["modal"]("show");
            $img_clone.css("width", "500px");
            $img_clone["cropper"]({
                "minContainerWidth": 500, "minContainerHeight": 400,
                built: function () {
                    $img_clone["cropper"]('setDragMode', "move");
                    var $divAnchor = $("<div class=\"anchorPoint\" >");
                    var $divPivot = $("<div class=\"pivotPoint\" >");
                    var $divContainer = $(".cropper-container");
                    $divContainer.append($divAnchor).append($divPivot);
                    var mouseDown = function () {
                        var $div = $(this);
                        $divContainer.mousemove(function (event) {
                            var dx = event.pageX - $(".cropper-container").offset()["left"];
                            var dy = event.pageY - $(".cropper-container").offset()["top"];
                            $div.css("top", dy - 5).css("left", dx - 5);
                            $div.data("top", dy).data("left", dx);
                            return true;
                        });
                        $divContainer.mouseup(function () {
                            $divContainer.unbind("mousemove");
                        });
                    };
                    $divPivot.mousedown(mouseDown);
                    $divAnchor.mousedown(mouseDown);
                }
            });
            $("#btnImageSeclection").off().click(function () {
                $("#cropImageModal")["modal"]("hide");
                var data = $img_clone["cropper"]("getData");
                var canvasData = $img_clone["cropper"]("getCanvasData");
                var texture = that.controller.getTextureHandler().getTexture(uuid);
                var rect = new Rect(data.x, data.y, data.x + data.width, data.y + data.height, texture);
                var anchor = {
                    "y": ($(".anchorPoint").data("top") - canvasData["top"]) * canvasData["naturalHeight"] / canvasData["height"],
                    "x": ($(".anchorPoint").data("left") - canvasData["left"]) * canvasData["naturalWidth"] / canvasData["width"]
                };
                var pivot = {
                    "y": ($(".pivotPoint").data("top") - canvasData["top"]) * canvasData["naturalHeight"] / canvasData["height"],
                    "x": ($(".pivotPoint").data("left") - canvasData["left"]) * canvasData["naturalWidth"] / canvasData["width"]
                };
                rect.setPivot(new THREE.Vector2(pivot.x, pivot.y));
                rect.setAnchor(new THREE.Vector2(anchor.x, anchor.y));
                var figure = new MonadFigure(rect);
                project.getFigures().push(figure);
                that.controller.update();
                //debugger;
            });
        };
    };
    return ImageHandler;
}());
