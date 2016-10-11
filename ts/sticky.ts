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
/// <reference path="project/project.ts" />

var mouseEventHandler = function($element: JQuery, callback, activator, deactivator) {
	var selectedNode: Node_ = null;
	$element.mousedown(function(e) { activator(e.offsetX - 1280 / 2, e.offsetY - 720 / 2) });
	$element.mouseleave(function() { deactivator() });
	$element.mouseup(function() { deactivator() });
	$element.mousemove(function(e) {
		callback(e.offsetX - 1280 / 2, e.offsetY - 720 / 2)
	});
}

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
		this.menuHandler = new MenuHandler(project);

		let $frame = $("#frame");
		let $timeline = $("#timeline");
		let $play = $("#btnPlay");
		let $resize = $("#btnResize");
		let $download = $("#btnDownload");

		let that = this;
		this.menuHandler.addCallback(function(project) {
			that.project = project;
			that.menuHandler.setProject(project);
			that.renderer.clearScene();
			$.each(that.project.getFigures(), function(index, figure) { that.renderer.addObject(figure.getVisual()); that.renderer.addObject(figure.getPhantom()); })
		})
		$.each(that.project.getFigures(), function(index, figure) { that.renderer.addObject(figure.getVisual()); that.renderer.addObject(figure.getPhantom()); })
		let $canvas = $(this.renderer.getDom());
		$play.click(function() {
			that.player.play(that.project.getFigures(), function() {
				$.each(that.project.getFigures(),
					function(index, figure) { figure.getRoot().draw(that.frameHandler.getFrame()) })
			});
		});
		$resize.click(function() { that.resizer.expand() });
		$download.click(function() {
			that.download.zipAndSave(that.project.getFigures()); $.each(that.project.getFigures(),
				function(index, figure) { figure.getRoot().draw(that.frameHandler.getFrame()) })
		});
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
		new MouseHandler(this.renderer);
		mouseEventHandler($canvas, function(x, y) {
			if (activeNode != null) {
				var frame = that.frameHandler.getFrame();
				let xOffset = activeNode.pivot.x;
				let yOffset = activeNode.pivot.y;
				if (activeNode.node.isRoot()) {
					activeNode.node.setPosition(x, y, frame);
				} else {
					activeNode.node.setAlpha(Math.atan2(-x + xOffset, -y + yOffset) - activeNode.alpha, frame);
				}
				activeNode.node.draw(frame);
				that.renderer.update();
				that.timelineHandler.updateFrame(frame);
			}
		}, function(x, y) {
			var frame = that.frameHandler.getFrame();
			for (var figure of that.project.getFigures()) {
				var node = figure.getRoot().getProximityNodes(frame, 1000, new THREE.Vector2(x, y));
				activeNode = activeNode == null ? node : (activeNode.distance > node.distance ? node : activeNode);
			}
			if (activeNode != null) {
				activeNode.node.activate();
				activeNode.node.getRoot().manifest(frame);
				that.renderer.update();
			}
		}, function() {
			if (activeNode != null) {
				activeNode.node.deactivate()
				activeNode = null;
				that.renderer.update();
			}
		});
		$frame.append($canvas);
		$('div.split-pane').splitPane();
		//roots[0].draw(1);
		this.renderer.update();
	}
}

$(document).ready(function() {
	window["sticky"] = new Sticky();
});