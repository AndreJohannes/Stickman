/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../sticky.ts" />

class NavbarHandler {

	private controller: Sticky;
	private $play: JQuery;
	private $resize: JQuery;
	private $download: JQuery;

	constructor(controller: Sticky) {
		var that = this;
		this.controller = controller;
		this.$play = $("#btnPlay");
		this.$resize = $("#btnResize");
		this.$download = $("#btnDownload");
		this.$play.click(function() { that.play() });
		this.$resize.click(function() { that.resize() });
		this.$download.click(function(){ that.download() });
	}

	private play() {
		var player: Player = this.controller.getPlayer();
		var figures: IFigure[] = this.controller.getProject().getFigures();
		var that = this;
		var callback = function() { that.controller.draw() };
		player.play(figures, callback);
	}

	private resize() {
		var resizer: CanvasResizer = this.controller.getResizer();
		resizer.expand();
	}

	private download(){
		var downloader: Download = this.controller.getDownloader();
		var figures: IFigure[] = this.controller.getProject().getFigures();
		downloader.zipAndSave(figures);
		this.controller.draw();
	}


}