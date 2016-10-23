/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/three.d.ts" />
/// <reference path="../renderer.ts" />
/// <reference path="../sticky.ts" />
/// <reference path="../figures/node.ts" />
var MouseMode;
(function (MouseMode) {
    MouseMode[MouseMode["IDEL"] = 0] = "IDEL";
    MouseMode[MouseMode["MOVE_FIGURE"] = 1] = "MOVE_FIGURE";
    MouseMode[MouseMode["MOVE_LIMB"] = 2] = "MOVE_LIMB";
    MouseMode[MouseMode["CHANGE_LENGTH"] = 3] = "CHANGE_LENGTH";
    MouseMode[MouseMode["ATTACH_TO_NODE"] = 4] = "ATTACH_TO_NODE";
    MouseMode[MouseMode["DETACH_FROM_NODE"] = 5] = "DETACH_FROM_NODE";
})(MouseMode || (MouseMode = {}));
var MouseHandler = (function () {
    function MouseHandler(controller) {
        this.mode = MouseMode.IDEL;
        this.controller = controller;
        this.renderer = controller.getRenderer();
        this.frameHandler = controller.getFrameHandler();
        this.$canvas = $(this.renderer.getDom());
        var that = this;
        this.resolution = [this.$canvas.width(), this.$canvas.height()];
        this.$canvas.mousedown(this.getMouseDownFunction());
        this.$canvas.mousemove(this.getMouseMoveFunction());
        this.$canvas.mouseup(this.getMouseUpFunction());
        this.$canvas.on("contextmenu", this.getContextMenuFunction());
        $("#tabChangeLength").click(function () { that.mode = MouseMode.CHANGE_LENGTH; $("#contextMenu").hide(); });
        $("#tabAttach").click(function () { that.mode = MouseMode.ATTACH_TO_NODE; $("#contextMenu").hide(); });
        $("#tabDetach").click(function (event) { that.mode = MouseMode.DETACH_FROM_NODE; that.activeNode = that.detachNode(that.activeNode, event); $("#contextMenu").hide(); });
        this.$canvas.click(function () {
            $("#contextMenu").hide();
        });
    }
    MouseHandler.prototype.setCanvasSize = function (size) {
        this.resolution = size;
    };
    MouseHandler.prototype.getProximityNode = function (position, frame, excludeFigure) {
        if (excludeFigure === void 0) { excludeFigure = null; }
        var figures = this.controller.getProject().getFigures();
        var retNode = null;
        for (var _i = 0, figures_1 = figures; _i < figures_1.length; _i++) {
            var figure = figures_1[_i];
            if (figure == excludeFigure)
                continue;
            var node = figure.getRoot().getProximityNodes(frame, 5, position);
            if (node != null)
                node["figure"] = figure;
            retNode = node == null ? retNode : (retNode == null ? node : (retNode.distance > node.distance ? node : retNode));
        }
        return retNode;
    };
    MouseHandler.prototype.getMousePosition = function (event) {
        return new THREE.Vector2(event.offsetX - this.resolution[0] / 2, event.offsetY - this.resolution[1] / 2);
    };
    MouseHandler.prototype.getMouseMoveFunction = function () {
        var that = this;
        return function (event) {
            if (that.mode == MouseMode.IDEL)
                return;
            var frame = that.frameHandler.getFrame();
            var xOffset = that.activeNode.pivot.x;
            var yOffset = that.activeNode.pivot.y;
            var position = that.getMousePosition(event);
            var x = position.x;
            var y = position.y;
            switch (that.mode) {
                case MouseMode.MOVE_LIMB:
                    that.activeNode.node.setAlpha(Math.atan2(-x + xOffset, -y + yOffset) - that.activeNode.alpha, frame);
                    break;
                case MouseMode.DETACH_FROM_NODE:
                case MouseMode.ATTACH_TO_NODE:
                case MouseMode.MOVE_FIGURE:
                    that.activeNode.node.setPosition(x, y, frame);
                    break;
                case MouseMode.CHANGE_LENGTH:
                    that.activeNode.node.setAlpha(Math.atan2(-x + xOffset, -y + yOffset) - that.activeNode.alpha, frame);
                    that.activeNode.node.setLength(position.distanceTo(new THREE.Vector2(xOffset, yOffset)));
                    break;
            }
            that.activeNode.node.draw(frame);
            that.renderer.update();
            //that.timelineHandler.updateFrame(frame);
        };
    };
    MouseHandler.prototype.getMouseDownFunction = function () {
        var that = this;
        return function (event) {
            switch (that.mode) {
                case MouseMode.IDEL:
                    var figures = that.controller.getProject().getFigures();
                    var frame = that.controller.getFrameHandler().getFrame();
                    var position = that.getMousePosition(event);
                    var node = that.getProximityNode(position, frame);
                    if (node != null) {
                        that.activeNode = node;
                        that.mode = node.node.isRoot() ? MouseMode.MOVE_FIGURE : MouseMode.MOVE_LIMB;
                        that.activeNode.node.getRoot().manifest(frame);
                        that.controller.getTimelineHandler().updateFrame(frame);
                    }
                    return;
                case MouseMode.CHANGE_LENGTH:
                    that.mode = MouseMode.IDEL;
                    return;
                case MouseMode.ATTACH_TO_NODE:
                    var frame = that.controller.getFrameHandler().getFrame();
                    var position = that.getMousePosition(event);
                    var figure = that.activeNode["figure"];
                    var node = that.getProximityNode(position, frame, figure);
                    if (node != null) {
                        node["node"].attachFigure(figure);
                        that.controller.getProject().removeFigure(figure);
                        that.controller.update();
                        that.mode = MouseMode.IDEL;
                    }
                case MouseMode.DETACH_FROM_NODE:
                    that.mode = MouseMode.IDEL;
            }
        };
    };
    MouseHandler.prototype.getMouseUpFunction = function () {
        var that = this;
        return function () {
            switch (that.mode) {
                case MouseMode.MOVE_FIGURE:
                case MouseMode.MOVE_LIMB:
                    that.mode = MouseMode.IDEL;
                    break;
            }
        };
    };
    MouseHandler.prototype.getContextMenuFunction = function () {
        var that = this;
        return function (event) {
            var frame = that.frameHandler.getFrame();
            var node = that.getProximityNode(that.getMousePosition(event), frame);
            if (node != null) {
                $("#contextMenu").show().css("left", event.clientX).css("top", event.clientY);
                that.activeNode = node;
                var isRoot = node.node.isRoot();
                $("#tabAttach").parent().removeClass().addClass(isRoot ? "" : "disabled");
                $("#tabDetach").parent().removeClass().addClass(!isRoot ? "" : "disabled");
            }
            return false;
        };
    };
    MouseHandler.prototype.detachNode = function (node, event) {
        var position = this.getMousePosition(event);
        var root = new Node_(position);
        var frame = this.frameHandler.getFrame();
        node.node.reattachToNode(root);
        var pivotFigure = new PivotFigure(root);
        this.controller.getProject().addFigure(pivotFigure);
        root.setPosition(position.x, position.y, frame);
        this.controller.update();
        return { "node": root, "pivot": { x: 0, y: 0 } };
    };
    return MouseHandler;
}());
