/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/splitpane.d.ts" />
/// <reference path="renderer.ts" />
/// <reference path="figures/stickman.ts" />
/// <reference path="figures/man.ts" />
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
        var $canvas = $("canvas");
        this.$verticalSplit.splitPane("lastComponentSize", $canvas.width() + 20);
        this.$horizontalSplit.splitPane("firstComponentSize", $canvas.height() + 1);
        this.$verticalSplit.splitPane("lastComponentSize", $canvas.width());
    };
    return CanvasResizer;
}());
var Sticky = (function () {
    function Sticky() {
        var project = new Project("testProject");
        //project.addFigure(new Stickman("Smart"));
        //project.addFigure(new Stickman("Dumb"));
        //project.addFigure(new Man("BG"));
        this.project = project;
        this.resizer = new CanvasResizer();
        this.renderer = new GLRenderer();
        this.player = new Player(this.renderer);
        this.download = new Download(this.renderer);
        this.frameHandler = new FrameHandler(this);
        this.timelineHandler = new TimelineHandler(this);
        this.menuHandler = new MenuHandler(this);
        this.mouseHandler = new MouseHandler(this);
        this.imageHandler = new ImageHandler(this);
        this.navbarHandler = new NavbarHandler(this);
        this.textureHandler = new TextureHandler(this);
        var $frame = $("#frame");
        var $timeline = $("#timeline");
        var $download = $("#btnDownload");
        var that = this;
        this.update();
        var $canvas = $(this.renderer.getDom());
        var activeNode = null;
        $frame.append($canvas);
        $('div.split-pane').splitPane();
        this.resizer.expand();
        this.renderer.update();
        setTimeout(function () {
            var texture = TextureHandler.Man;
            var rectTorso = new Rect(6, 13, 33, 95, texture);
            rectTorso.setPivot(new THREE.Vector2(15, 82));
            rectTorso.setAnchor(new THREE.Vector2(17, 24));
            that.project.addFigure(new MonadFigure(rectTorso));
            that.update();
            var rectLeg = new Rect(0, 100, 29, 168, texture);
            rectLeg.setPivot(new THREE.Vector2(15, 112));
            rectLeg.setAnchor(new THREE.Vector2(18.5, 159.5));
            that.project.addFigure(new MonadFigure(rectLeg));
            that.update();
        }, 1000);
    }
    Sticky.prototype.getProject = function () { return this.project; };
    ;
    Sticky.prototype.getRenderer = function () { return this.renderer; };
    ;
    Sticky.prototype.getFrameHandler = function () { return this.frameHandler; };
    ;
    Sticky.prototype.getTimelineHandler = function () { return this.timelineHandler; };
    ;
    Sticky.prototype.getPlayer = function () { return this.player; };
    ;
    Sticky.prototype.getResizer = function () { return this.resizer; };
    ;
    Sticky.prototype.getDownloader = function () { return this.download; };
    ;
    Sticky.prototype.setProject = function (project) { this.project = project; };
    Sticky.prototype.getTextureHandler = function () { return this.textureHandler; };
    ;
    Sticky.prototype.update = function () {
        this.imageHandler.update();
        this.timelineHandler.update();
        this.renderer.resize(this.project.getSize());
        this.mouseHandler.setCanvasSize(this.project.getSize());
        this.renderer.clearScene();
        var that = this;
        $.each(this.project.getFigures(), function (index, figure) { that.renderer.addObject(figure.getVisual()); that.renderer.addObject(figure.getPhantom()); });
        this.draw();
    };
    Sticky.prototype.updateFrame = function (frame) {
        this.timelineHandler.setFrame(frame);
        this.frameHandler.setFrame(frame);
        this.draw();
    };
    Sticky.prototype.draw = function () {
        var frame = this.frameHandler.getFrame();
        $.each(this.project.getFigures(), function (index, figure) { figure.getRoot().draw(frame); });
        this.renderer.update();
    };
    Sticky.prototype.redraw = function () {
        this.renderer.update();
    };
    return Sticky;
}());
$(document).ready(function () {
    window["sticky"] = new Sticky();
});
