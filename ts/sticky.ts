/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/splitpane.d.ts" />
/// <reference path="renderer.ts" />
/// <reference path="figures/stickman.ts" />
/// <reference path="figures/ifigure.ts" />
/// <reference path="figures/background.ts" />
/// <reference path="player.ts" />
/// <reference path="download.ts" />
/// <reference path="handlers/timeline.ts" />

var mouseEventHandler = function($element: JQuery, callback, activator, deactivator) {
	var selectedNode: Node_ = null;
	$element.mousedown(function(e) { activator(e.offsetX - 1280 / 2, e.offsetY - 720 / 2) });
	$element.mouseleave(function() { deactivator() });
	$element.mouseup(function() { deactivator() });
	$element.mousemove(function(e) {
		callback(e.offsetX - 1280 / 2, e.offsetY - 720 / 2)
	});
}

var FrameHandler = function() {
	var frameNumber = 1;
	var callbacks = [];
	let $btnUp = $("#btnFrameUp");
	let $btnDown = $("#btnFrameDown");
	let $iptFrame = $("#iptFrame");
	var setFrameNumber = function(frame: number) {
		frameNumber = frame > 0 ? frame : frameNumber;
		$iptFrame.val(frameNumber);
		for (var callback of callbacks)
			callback(frameNumber);
	}
	$btnUp.click(function() { setFrameNumber(frameNumber + 1) });
	$btnDown.click(function() { setFrameNumber(frameNumber - 1) });
	$iptFrame.change(function() {
		var val = $iptFrame.val(); if ($.isNumeric(val))
		{ setFrameNumber(Math.round(val)) }
	});
	this.addCallback = function(cb) {
		callbacks.push(cb);
	}
	this.getFrame = function() {
		return frameNumber;
	}
	this.setFrame = function(frame: number) {
		setFrameNumber(frame);
	}
}

var canvasResizer = function(renderer: GLRenderer) {
	let $div = $("#right-component");
	var hasResized = false
	let aspectRation = 1280 / 720;
	$(".split-pane").on('splitpaneresize', function() { hasResized = true; });
	$(window).mouseup(function() {
		if (hasResized && false) {
			hasResized = false;
			var height = $div.height() - 1;
			var width = $div.width() - 1;
			if (width / height > aspectRation) {
				renderer.resize(aspectRation * height, height);
			} else {
				renderer.resize(width, width / aspectRation);
			}
		}
	});
}

var canvasResizer2 = function() {
	let $horizontalSplit = $("div.split-pane").eq(0);
	let $verticalSplit = $("div.split-pane").eq(1);
	this.expand = function() {
		$verticalSplit.splitPane("lastComponentSize", 1300);
		$horizontalSplit.splitPane("firstComponentSize", 721);
		$verticalSplit.splitPane("lastComponentSize", 1280);
	};

}


$(document).ready(function() {
	let stickman1: IFigure = new Stickman("Smart");
	let stickman2: IFigure = new Stickman("Dumb");
	//let background: IFigure = new Background();
	let figures: IFigure[] = [stickman1, stickman2];
	let $frame = $("#frame");
	let $timeline = $("#timeline");
	let $play = $("#btnPlay");
	let $resize = $("#btnResize");
	let $download = $("#btnDownload");
	let resizer = new canvasResizer2();
	let renderer = new GLRenderer();
	let player = new Player(renderer);
	let download = new Download(renderer);
	let frameHandler = new FrameHandler();
	let timelineHandler = new TimelineHandler(figures);
	window["timelineHandler"] = timelineHandler;
	renderer.addObject(stickman1.getVisual());
	renderer.addObject(stickman1.getPhantom());
	renderer.addObject(stickman2.getVisual());
	renderer.addObject(stickman2.getPhantom());
	//renderer.addObject(background.getObject());
	let $canvas = $(renderer.getDom());
	$play.click(function() { player.play(figures, function() { $.each(figures, function(index, figure) { figure.getRoot().draw(frameHandler.getFrame()) }) }); });
	$resize.click(function() { resizer.expand() });
	$download.click(function() { download.zipAndSave(figures); $.each(figures, function(index, figure) { figure.getRoot().draw(frameHandler.getFrame()) }) });
	frameHandler.addCallback(timelineHandler.setFrame);
	frameHandler.addCallback(function(frame: number) { $.each(figures, function(index, figure) { figure.getRoot().draw(frame); }); renderer.update() });
	timelineHandler.addCallback(frameHandler.setFrame);
	timelineHandler.addCallback(function(frame: number) { $.each(figures, function(index, figure) { figure.getRoot().draw(frame); }); renderer.update() });
	var activeNode = null;
	mouseEventHandler($canvas, function(x, y) {
		if (activeNode != null) {
			var frame = frameHandler.getFrame();
			let xOffset = activeNode.pivot.x;
			let yOffset = activeNode.pivot.y;
			if (activeNode.node.isRoot()) {
				activeNode.node.setPosition(x, y, frame);
			} else {
				activeNode.node.setAlpha(Math.atan2(-x + xOffset, -y + yOffset) - activeNode.alpha, frame);
			}
			activeNode.node.draw(frame);
			renderer.update();
			timelineHandler.updateFrame(frame);
		}
	}, function(x, y) {
		var frame = frameHandler.getFrame();
		for (var figure of figures) {
			var node = figure.getRoot().getProximityNodes(frame, 1000, new THREE.Vector2(x, y));
			activeNode = activeNode == null ? node : (activeNode.distance > node.distance ? node : activeNode);
		}
		if (activeNode != null) {
			activeNode.node.activate();
			activeNode.node.getRoot().manifest(frame);
			renderer.update();
		}
	}, function() {
		if (activeNode != null) {
			activeNode.node.deactivate()
			activeNode = null;
			renderer.update();
		}
	});
	$frame.append($canvas);
	$('div.split-pane').splitPane();
	//roots[0].draw(1);
	renderer.update();
	//canvasResizer(renderer);
});