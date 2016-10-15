/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/splitpane.d.ts" />
/// <reference path="renderer.ts" />
/// <reference path="figures/stickman.ts" />
/// <reference path="figures/ifigure.ts" />
/// <reference path="figures/background.ts" />
/// <reference path="player.ts" />
/// <reference path="download.ts" />
/// <reference path="handlers/timeline.ts" />
/// <reference path="handlers/menu.ts" />
/// <reference path="handlers/frame.ts" />
/// <reference path="handlers/mouse.ts" />
/// <reference path="handlers/images.ts" />
/// <reference path="handlers/navbar.ts" />
/// <reference path="project/project.ts" />
var CanvasResizer = (function () {
    function CanvasResizer() {
        this.$horizontalSplit = $("div.split-pane").eq(0);
        this.$verticalSplit = $("div.split-pane").eq(1);
    }
    CanvasResizer.prototype.expand = function () {
        this.$verticalSplit.splitPane("lastComponentSize", 1300);
        this.$horizontalSplit.splitPane("firstComponentSize", 721);
        this.$verticalSplit.splitPane("lastComponentSize", 1280);
    };
    return CanvasResizer;
}());
var Sticky = (function () {
    function Sticky() {
        var project = new Project("testProject");
        project.addFigure(new Stickman("Smart"));
        project.addFigure(new Stickman("Dumb"));
        project.addFigure(new Background("BG"));
        this.project = project;
        this.resizer = new CanvasResizer();
        this.renderer = new GLRenderer();
        this.player = new Player(this.renderer);
        this.download = new Download(this.renderer);
        this.frameHandler = new FrameHandler();
        this.timelineHandler = new TimelineHandler(project);
        this.menuHandler = new MenuHandler(this);
        this.mouseHandler = new MouseHandler(this);
        this.imageHandler = new ImageHandler(this);
        this.navbarHandler = new NavbarHandler(this);
        var $frame = $("#frame");
        var $timeline = $("#timeline");
        var $download = $("#btnDownload");
        var that = this;
        this.menuHandler.addCallback(function (project) {
            that.project = project;
            that.renderer.clearScene();
            $.each(that.project.getFigures(), function (index, figure) { that.renderer.addObject(figure.getVisual()); that.renderer.addObject(figure.getPhantom()); });
        });
        $.each(that.project.getFigures(), function (index, figure) { that.renderer.addObject(figure.getVisual()); that.renderer.addObject(figure.getPhantom()); });
        var $canvas = $(this.renderer.getDom());
        this.frameHandler.addCallback(that.timelineHandler.setFrame);
        this.frameHandler.addCallback(function (frame) {
            $.each(that.project.getFigures(), function (index, figure) { figure.getRoot().draw(frame); });
            that.renderer.update();
        });
        this.timelineHandler.addCallback(that.frameHandler.setFrame);
        this.timelineHandler.addCallback(function (frame) {
            $.each(that.project.getFigures(), function (index, figure) { figure.getRoot().draw(frame); });
            that.renderer.update();
        });
        var activeNode = null;
        $frame.append($canvas);
        $('div.split-pane').splitPane();
        //roots[0].draw(1);
        this.renderer.update();
    }
    Sticky.prototype.getProject = function () { return this.project; };
    ;
    Sticky.prototype.getRenderer = function () { return this.renderer; };
    ;
    Sticky.prototype.getFrameHandler = function () { return this.frameHandler; };
    ;
    Sticky.prototype.getPlayer = function () { return this.player; };
    ;
    Sticky.prototype.getResizer = function () { return this.resizer; };
    ;
    Sticky.prototype.getDownloader = function () { return this.download; };
    ;
    Sticky.prototype.update = function () {
        this.imageHandler.update();
    };
    Sticky.prototype.draw = function () {
        var frame = this.frameHandler.getFrame();
        $.each(this.project.getFigures(), function (index, figure) { figure.getRoot().draw(frame); });
    };
    Sticky.prototype.redraw = function () {
        this.renderer.update();
    };
    return Sticky;
}());
$(document).ready(function () {
    window["sticky"] = new Sticky();
});
