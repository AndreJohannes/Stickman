/// <reference path="renderer.ts" />
/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/jszip.d.ts" />
/// <reference path="./definitions/FileSaver.d.ts" />
/// <reference path="./figures/node.ts" />
/// <reference path="./figures/ifigure.ts" />
var Download = (function () {
    function Download(renderer) {
        this.renderer = renderer;
    }
    Download.prototype.zipAndSave = function (figures) {
        var $progress = $("#divProgress");
        var that = this;
        var zip = new JSZip();
        var asyncList = [];
        $.each(figures, function (index, figure) { figure.getRoot().setMode(NodeMode.Play); });
        var pack = 0;
        var _loop_1 = function() {
            var frame = i;
            asyncList.push(function () {
                $.each(figures, function (index, figure) { figure.getRoot().draw(frame); });
                that.renderer.update();
                var img = $("canvas").get(0)["toDataURL"]();
                zip.file("frame" + frame + ".png", img.replace("data:image/png;base64,", ""), { base64: true });
                pack++;
                $progress.css("width", 100 / 99 * pack + "%");
                console.log(pack);
                if (asyncList.length != 0) {
                    setTimeout(asyncList.pop(), 0);
                }
                else {
                    $("#prepareZipModal")["modal"]("hide");
                    zip.generateAsync({ type: "blob" }).then(function (content) {
                        saveAs(content, "test.zip");
                    });
                }
            });
        };
        for (var i = 1; i <= 99; i++) {
            _loop_1();
        }
        // We use setTimeout to build the frames and zip asynchronously; the web-interface will be responsive
        setTimeout(asyncList.pop(), 0);
    };
    return Download;
}());
