/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/FileSaver.d.ts" />
/// <reference path="../definitions/jszip.d.ts" />
/// <reference path="../definitions/jquery.validation.d.ts" />
/// <reference path="../figures/ifigure.ts" />
/// <reference path="../project/project.ts" />
/// <reference path="../project/storage.ts" />
/// <reference path="../sticky.ts" />
var TabsHandler = (function () {
    function TabsHandler(controller) {
        var that = this;
        this.controller = controller;
        /************ Player tab  **********/
        $("#iptFPS")["slider"]().on("slide", function () {
            var value = $(this).data("slider").getValue();
            that.controller.getPlayer().setFPS(value);
        });
        $("#iptLoop").on("click", function () {
            that.controller.getPlayer().loop($(this).is(":checked"));
        });
        $("#btnTabPlay").click(function () { that.play(); });
        $("#btnTabPause").click(function () { that.stop(); });
        $("#iptPlyFirstFrame").change(function () { that.playerFirstFrame($(this)); });
        $("#iptPlyLastFrame").change(function () { that.playerLastFrame($(this)); });
        /********** Download tab **********/
        $("#btnTabDownload").click(function () { that.download(); });
        $("#iptDldFirstFrame").change(function () { that.dldFirstFrame($(this)); });
        $("#iptDldLastFrame").change(function () { that.dldLastFrame($(this)); });
    }
    /** Player methods ***/
    TabsHandler.prototype.play = function () {
        var player = this.controller.getPlayer();
        var figures = this.controller.getProject().getFigures();
        var that = this;
        var callback = function () { that.controller.draw(); };
        player.play(figures, callback);
    };
    TabsHandler.prototype.stop = function () {
        var player = this.controller.getPlayer();
        player.stop();
    };
    TabsHandler.prototype.playerFirstFrame = function (elem) {
        var player = this.controller.getPlayer();
        player.setStartFrame(parseInt(elem.val()));
    };
    TabsHandler.prototype.playerLastFrame = function (elem) {
        var player = this.controller.getPlayer();
        player.setStopFrame(parseInt(elem.val()));
    };
    /*** Download methodsa */
    TabsHandler.prototype.download = function () {
        $("#prepareZipModal")["modal"]("show");
        var downloader = this.controller.getDownloader();
        var figures = this.controller.getProject().getFigures();
        downloader.zipAndSave(figures);
        this.controller.draw();
    };
    TabsHandler.prototype.dldFirstFrame = function (elem) {
        var downloader = this.controller.getDownloader();
        downloader.setStartFrame(parseInt(elem.val()));
    };
    TabsHandler.prototype.dldLastFrame = function (elem) {
        var downloader = this.controller.getDownloader();
        downloader.setStopFrame(parseInt(elem.val()));
    };
    return TabsHandler;
}());
