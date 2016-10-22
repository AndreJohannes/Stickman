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

class CanvasResizer {

	private $horizontalSplit: JQuery;
	private $verticalSplit: JQuery;

	constructor() {
		this.$horizontalSplit = $("div.split-pane").eq(0);
		this.$verticalSplit = $("div.split-pane").eq(1);
	}

	public expand() {
		let $canvas = $("canvas");
		this.$verticalSplit.splitPane("lastComponentSize", $canvas.width() + 20);
		this.$horizontalSplit.splitPane("firstComponentSize", $canvas.height() + 1);
		this.$verticalSplit.splitPane("lastComponentSize", $canvas.width());
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
	private textureHandler: TextureHandler;

	constructor() {
		let project: Project = new Project("testProject");
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

		let $frame = $("#frame");
		let $timeline = $("#timeline");
		let $download = $("#btnDownload");

		let that = this;
		this.update();
		let $canvas = $(this.renderer.getDom());

		var activeNode = null;
		$frame.append($canvas);
		$('div.split-pane').splitPane();
		this.resizer.expand();
		this.renderer.update();

		setTimeout(function() {
			let texture = TextureHandler.Man;
			var rectTorso: Rect = new Rect(6, 13, 33, 95, texture);
			rectTorso.setPivot(new THREE.Vector2(15, 82));
			rectTorso.setAnchor(new THREE.Vector2(17, 24));
			that.project.addFigure(new MonadFigure(rectTorso));
			that.update();
			var rectLeg: Rect = new Rect(0, 100, 29, 168, texture);
			rectLeg.setPivot(new THREE.Vector2(15, 112));
			rectLeg.setAnchor(new THREE.Vector2(18.5, 159.5));
			that.project.addFigure(new MonadFigure(rectLeg));
			that.update();
		}, 1000);
	}

	public getProject(): Project { return this.project };
	public getRenderer(): GLRenderer { return this.renderer };
	public getFrameHandler(): FrameHandler { return this.frameHandler };
	public getTimelineHandler(): TimelineHandler { return this.timelineHandler };
	public getPlayer(): Player { return this.player };
	public getResizer(): CanvasResizer { return this.resizer };
	public getDownloader(): Download { return this.download };
	public setProject(project: Project) { this.project = project; }
	public getTextureHandler() { return this.textureHandler; };

	public update() {
		this.imageHandler.update();
		this.timelineHandler.update();
		this.renderer.resize(this.project.getSize());
		this.mouseHandler.setCanvasSize(this.project.getSize());
		this.renderer.clearScene();
		let that = this;
		$.each(this.project.getFigures(), function(index, figure) { that.renderer.addObject(figure.getVisual()); that.renderer.addObject(figure.getPhantom()); })
		this.draw();
	}

	public updateFrame(frame: number) {
		this.timelineHandler.setFrame(frame);
		this.frameHandler.setFrame(frame);
		this.draw();
	}

	public draw() {
		var frame = this.frameHandler.getFrame();
		$.each(this.project.getFigures(),
			function(index, figure) { figure.getRoot().draw(frame) });
		this.renderer.update();
	}

	public redraw() {
		this.renderer.update();
	}

}

$(document).ready(function() {
	window["sticky"] = new Sticky();
});