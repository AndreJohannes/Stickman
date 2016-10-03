/// <reference path="definitions/jquery.d.ts" />
/// <reference path="renderer.ts" />
/// <reference path="figures/stickman.ts" />
/// <reference path="figures/background.ts" />
var mouseEventHandler = function ($element, callback, activator, deactivator) {
    var selectedNode = null;
    $element.mousedown(function (e) { activator(e.offsetX - 1280 / 2, e.offsetY - 720 / 2); });
    $element.mouseleave(function () { deactivator(); });
    $element.mouseup(function () { deactivator(); });
    $element.mousemove(function (e) {
        callback(e.offsetX - 1280 / 2, e.offsetY - 720 / 2);
    });
};
var FrameHandler = function () {
    var frameNumber = 1;
    var $btnUp = $("#btnFrameUp");
    var $btnDown = $("#btnFrameDown");
    var $iptFrame = $("#iptFrame");
    $btnUp.click(function () { frameNumber++; $iptFrame.val(frameNumber); });
    $btnDown.click(function () { frameNumber--; frameNumber = frameNumber < 1 ? 1 : frameNumber; $iptFrame.val(frameNumber); });
    $iptFrame.change(function () { var val = $iptFrame.val(); if ($.isNumeric(val)) {
        frameNumber = Math.round(val);
    } $iptFrame.val(frameNumber); });
};
var TimelineHandler = function () {
    var frame = 1;
    var $timeline = $("#timeline");
    var $trFirst = $timeline.find("tr").first();
    var $table = $("table");
    var trList = [];
    for (i = 0; i < 5; i++) {
        var $tr = $("<tr></tr>");
        trList.push($tr);
        $table.append($tr);
    }
    for (var i = 1; i < 50; i++) {
        var $th = $("<th>" + i + "</th>");
        $trFirst.append($th);
        for (var _i = 0, trList_1 = trList; _i < trList_1.length; _i++) {
            var $tr_1 = trList_1[_i];
            var $td = $("<td><div class=\"brick\"></div></td>");
            $tr_1.append($td);
        }
    }
    this.setFrame = function (frame) {
        $("th").css("background-color", "");
        this.frame = frame;
        $($("th").get(frame - 10)).css("background-color", "red");
    };
    this.setFrame(1);
};
var canvasResizer = function (renderer) {
    var $div = $("#right-component");
    var hasResized = false;
    var aspectRation = 1280 / 720;
    $(".split-pane").on('splitpaneresize', function () { hasResized = true; });
    $(window).mouseup(function () {
        if (hasResized && false) {
            hasResized = false;
            var height = $div.height() - 1;
            var width = $div.width() - 1;
            if (width / height > aspectRation) {
                renderer.resize(aspectRation * height, height);
            }
            else {
                renderer.resize(width, width / aspectRation);
            }
        }
    });
};
$(document).ready(function () {
    var stickman = new Stickman();
    var background = new Background();
    window["stickman"] = stickman;
    var $frame = $("#frame");
    var $timeline = $("#timeline");
    var renderer = new GLRenderer();
    renderer.addObject(stickman.getObject());
    renderer.addObject(background.getObject());
    var $canvas = $(renderer.getDom());
    var roots = [background.getRoot(), stickman.getRoot()];
    var activeNode = null;
    mouseEventHandler($canvas, function (x, y) {
        if (activeNode != null) {
            var xOffset = activeNode.pivot.x;
            var yOffset = activeNode.pivot.y;
            if (activeNode.node.isRoot()) {
                activeNode.node.setPosition(x, y);
            }
            else {
                activeNode.node.setAlpha(Math.atan2(-x + xOffset, -y + yOffset) - activeNode.alpha);
            }
            console.log(xOffset, yOffset);
            renderer.update();
        }
    }, function (x, y) {
        for (var _i = 0, roots_1 = roots; _i < roots_1.length; _i++) {
            var root = roots_1[_i];
            var node = root.getProximityNodes(1000, new THREE.Vector2(x, y));
            activeNode = activeNode == null ? node : (activeNode.distance > node.distance ? node : activeNode);
        }
        if (activeNode != null) {
            activeNode.node.activate();
            renderer.update();
        }
    }, function () {
        if (activeNode != null) {
            activeNode.node.deactivate();
            activeNode = null;
            renderer.update();
        }
    });
    var frameHandler = FrameHandler();
    $frame.append($canvas);
    var timelineHandler = new TimelineHandler();
    timelineHandler.setFrame(12);
    $('div.split-pane').splitPane();
    canvasResizer(renderer);
    //var i =0;
    //renderer.animate()
    //setInterval(function(){roots[0].setPosition((i+1280/2)%1280-1280/2,0);i+=55 ;},33/2);
});
