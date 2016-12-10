/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/FileSaver.d.ts" />
/// <reference path="../definitions/jszip.d.ts" />
/// <reference path="../definitions/jquery.validation.d.ts" />
/// <reference path="../figures/ifigure.ts" />
/// <reference path="../project/project.ts" />
/// <reference path="../project/storage.ts" />
/// <reference path="../sticky.ts" />

class TabsHandler {

	private controller: Sticky;

	constructor(controller: Sticky) {
		var that = this;
		this.controller = controller;

		/************ Player tab  **********/
		$("#iptFPS")["slider"]().on("slide", function() {
			let value = $(this).data("slider").getValue();
			that.controller.getPlayer().setFPS(value);
		}).trigger("slide");

		$("#iptLoop").on("click", function(){
			that.controller.getPlayer().loop($(this).is(":checked"));
		});

		$("#btnTabPlay").click(function() { that.play() });
		$("#btnTabPause").click(function() { that.stop() });
		$("#iptPlyFirstFrame").change(function(){that.playerFirstFrame($(this))}).trigger("change");
		$("#iptPlyLastFrame").change(function(){that.playerLastFrame($(this))}).trigger("change");

		/********** Download tab **********/
		$("#btnTabDownload").click(function() { that.download() });
		$("#iptDldFirstFrame").change(function(){that.dldFirstFrame($(this))});
		$("#iptDldLastFrame").change(function(){that.dldLastFrame($(this))});

	}

	/** Player methods ***/
	private play() {
		var player: Player = this.controller.getPlayer();
		var figures: IFigure[] = this.controller.getProject().getFigures();
		var that = this;
		var callback = function() { that.controller.draw() };
		player.play(figures, callback);
	}

	private stop(){
		var player: Player = this.controller.getPlayer();
		player.stop();
	}

	private playerFirstFrame(elem: JQuery){
		var player: Player = this.controller.getPlayer();
		player.setStartFrame(parseInt(elem.val()));
	}

	private playerLastFrame(elem: JQuery){
		var player: Player = this.controller.getPlayer();
		player.setStopFrame(parseInt(elem.val()));
	}

	/*** Download methodsa */
	private download(){
		$("#prepareZipModal")["modal"]("show");
		var downloader: Download = this.controller.getDownloader();
		var figures: IFigure[] = this.controller.getProject().getFigures();
		downloader.zipAndSave(figures);
		this.controller.draw();
	}

	private dldFirstFrame(elem: JQuery){
		var downloader: Download = this.controller.getDownloader();
		downloader.setStartFrame(parseInt(elem.val()));
	}

	private dldLastFrame(elem: JQuery){
		var downloader: Download = this.controller.getDownloader();
		downloader.setStopFrame(parseInt(elem.val()));
	}

}