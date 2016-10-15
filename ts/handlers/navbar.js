/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../sticky.ts" />
var NavbarHandler = (function () {
    function NavbarHandler(controller) {
        var that = this;
        this.controller = controller;
        this.$play = $("#btnPlay");
        this.$resize = $("#btnResize");
        this.$download = $("#btnDownload");
        this.$play.click(function () { that.play(); });
        this.$resize.click(function () { that.resize(); });
        this.$download.click(function () { that.download(); });
    }
    NavbarHandler.prototype.play = function () {
        var player = this.controller.getPlayer();
        var figures = this.controller.getProject().getFigures();
        var that = this;
        var callback = function () { that.controller.draw(); };
        player.play(figures, callback);
    };
    NavbarHandler.prototype.resize = function () {
        var resizer = this.controller.getResizer();
        resizer.expand();
    };
    NavbarHandler.prototype.download = function () {
        var downloader = this.controller.getDownloader();
        var figures = this.controller.getProject().getFigures();
        downloader.zipAndSave(figures);
        this.controller.draw();
    };
    return NavbarHandler;
}());
