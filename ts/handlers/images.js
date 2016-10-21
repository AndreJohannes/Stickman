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
        var _loop_1 = function() {
            var uuid = key;
            var $img = $("<img>");
            $img.attr("src", images[uuid]);
            $img.data("uuid", uuid);
            $img.click(function () {
                var $img_clone = $img.clone();
                $("#cropImageModal .modal-body").empty().append($img_clone);
                $("#cropImageModal")["modal"]("show");
                $img_clone.css("width", "500px");
                $img_clone["cropper"]({
                    "minContainerWidth": 500, "minContainerHeight": 400,
                    built: function () {
                        $img_clone["cropper"]('setDragMode', "move");
                    }
                });
                $("#btnImageSeclection").off().click(function () {
                    var data = $img_clone["cropper"]("getData");
                    var texture = that.controller.getTextureHandler().getTexture(uuid);
                    var rect = new Rect(data.x, data.y, data.x + data.width, data.y + data.height, texture);
                    rect.setPivot(new THREE.Vector2(data.x, data.y));
                    rect.setAnchor(new THREE.Vector2(data.x + data.width, data.y + data.height));
                    var figure = new MonadFigure(rect);
                    project.getFigures().push(figure);
                    that.controller.update();
                    //debugger;
                });
            });
            this_1.$images.append($img);
        };
        var this_1 = this;
        for (var key in images) {
            _loop_1();
        }
    };
    return ImageHandler;
}());
