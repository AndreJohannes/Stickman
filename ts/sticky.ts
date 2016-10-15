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

class CanvasResizer {

	private $horizontalSplit: JQuery;
	private $verticalSplit: JQuery;

	constructor() {
		this.$horizontalSplit = $("div.split-pane").eq(0);
		this.$verticalSplit = $("div.split-pane").eq(1);
	}

	public expand() {
		this.$verticalSplit.splitPane("lastComponentSize", 1300);
		this.$horizontalSplit.splitPane("firstComponentSize", 721);
		this.$verticalSplit.splitPane("lastComponentSize", 1280);
	}

}

class Sticky {

	private project: Project;
	private resizer: CanvasResizer;
	private renderer: GLRenderer;
	private player: Player;
	private download: Download;
	private frameHandler: FrameHandler;
	private timelineHandler: TimelineHandler;
	private menuHandler: MenuHandler;
	private mouseHandler: MouseHandler;
	private imageHandler: ImageHandler;
	private navbarHandler: NavbarHandler;

	constructor() {
		let project: Project = new Project("testProject");
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

		let $frame = $("#frame");
		let $timeline = $("#timeline");
		let $download = $("#btnDownload");

		let that = this;
		this.menuHandler.addCallback(function(project) {
			that.project = project;
			that.renderer.clearScene();
			$.each(that.project.getFigures(), function(index, figure) { that.renderer.addObject(figure.getVisual()); that.renderer.addObject(figure.getPhantom()); })
		})
		$.each(that.project.getFigures(), function(index, figure) { that.renderer.addObject(figure.getVisual()); that.renderer.addObject(figure.getPhantom()); })
		let $canvas = $(this.renderer.getDom());

		this.frameHandler.addCallback(that.timelineHandler.setFrame);
		this.frameHandler.addCallback(function(frame: number) {
			$.each(that.project.getFigures(),
				function(index, figure) { figure.getRoot().draw(frame); }); that.renderer.update()
		});
		this.timelineHandler.addCallback(that.frameHandler.setFrame);
		this.timelineHandler.addCallback(function(frame: number) {
			$.each(that.project.getFigures(),
				function(index, figure) { figure.getRoot().draw(frame); }); that.renderer.update()
		});
		var activeNode = null;
		$frame.append($canvas);
		$('div.split-pane').splitPane();
		//roots[0].draw(1);
		this.renderer.update();
	}

	public getProject(): Project { return this.project };
	public getRenderer(): GLRenderer { return this.renderer };
	public getFrameHandler(): FrameHandler { return this.frameHandler };
	public getPlayer(): Player { return this.player };
	public getResizer(): CanvasResizer { return this.resizer };
	public getDownloader(): Download { return this.download };

	public update() {
		this.imageHandler.update();
	}

	public draw() {
		var frame = this.frameHandler.getFrame();
		$.each(this.project.getFigures(),
			function(index, figure) { figure.getRoot().draw(frame) });
	}

	public redraw(){
		this.renderer.update();
	}

}

$(document).ready(function() {
	window["sticky"] = new Sticky();
});