/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../definitions/three.d.ts" />
/// <reference path="../renderer.ts" />
/// <reference path="../sticky.ts" />
/// <reference path="../figures/node.ts" />

enum MouseMode {
	IDEL,
	MOVE_FIGURE,
	MOVE_LIMB,
	CHANGE_LENGTH
}


class MouseHandler {

	private mode: MouseMode = MouseMode.IDEL;
	private activeNode;
	private controller: Sticky;
	private renderer: GLRenderer;
	private frameHandler: FrameHandler;
	private $canvas: JQuery;

	constructor(controller: Sticky) {
		this.controller = controller;
		this.renderer = controller.getRenderer();
		this.frameHandler = controller.getFrameHandler();
		this.$canvas = $(this.renderer.getDom());
		var that = this;

		this.$canvas.mousedown(this.getMouseDownFunction());
		this.$canvas.mousemove(this.getMouseMoveFunction());
		this.$canvas.mouseup(this.getMouseUpFunction());

		this.$canvas.on("contextmenu", this.getContextMenuFunction());

		$("#tabChangeLength").click(function() { that.mode = MouseMode.CHANGE_LENGTH; });
		// 	function(event) {
		// 	var frame = that.frameHandler.getFrame();
		// 	var node = that.getProximityNode(that.getMousePosition(event), frame);
		// 	if (node != null) {
		// 		$("#contextMenu").show().css("left", event.clientX).css("top", event.clientY);
		// 		$("#tabDetach").off().click(function() {
		// 		});
		// 		$("#tabChangeLength").off().click(function() {
		// 			$("#contextMenu").hide();
		// 			let xOffset = node.pivot.x;
		// 			let yOffset = node.pivot.y;
		// 			var changeLength = that.$canvas.mousemove(function(event) {
		// 				var position = that.getMousePosition(event);
		// 				console.log(position.x, position.y);
		// 				node.node.setAlpha(Math.atan2(-position.x + xOffset, -position.y + yOffset) - node.alpha, frame);
		// 				node.node.setLength(position.distanceTo(new THREE.Vector2(xOffset, yOffset)));
		// 				node.node.draw(frame);
		// 				that.renderer.update();
		// 			});
		// 			that.$canvas.click(function() {
		// 				that.$canvas.unbind("mousemove");
		// 			})
		// 		});
		// 		$("#tabAddLink").off().click(function() {
		// 			var newNode = new Node_(60, 0);
		// 			node.node.addChild(newNode);
		// 			newNode.addVisual(new Limb(60), new Limb(60, true));
		// 		});
		// 	}
		// 	return false; // supress the native manu;
		// });

		this.$canvas.click(function() {
			$("#contextMenu").hide();
		})
		//this.$canvas.mousemove(function(e) {
		//	console.log(e.offsetX - 1280 / 2, e.offsetY - 720 / 2)
		//})
	}

	private getProximityNode(position: THREE.Vector2, frame: number) {
		var figures = this.controller.getProject().getFigures();
		var retNode = null;
		for (var figure of figures) {
			var node = figure.getRoot().getProximityNodes(frame, 5, position);
			retNode = node == null ? retNode : (retNode == null ? node : (retNode.distance > node.distance ? node : retNode));
		}
		return retNode;
	}

	private getMousePosition(event): THREE.Vector2 {
		return new THREE.Vector2(event.offsetX - 1280 / 2, event.offsetY - 720 / 2);
	}

	private getMouseMoveFunction() {
		var that = this;
		return function(event) {
			if (that.mode == MouseMode.IDEL) return;
			var frame = that.frameHandler.getFrame();
			let xOffset = that.activeNode.pivot.x;
			let yOffset = that.activeNode.pivot.y;
			var position: THREE.Vector2 = that.getMousePosition(event);
			var x = position.x;
			var y = position.y;
			switch (that.mode) {
				case MouseMode.MOVE_LIMB:
					that.activeNode.node.setAlpha(Math.atan2(-x + xOffset, -y + yOffset) - that.activeNode.alpha, frame);
					break;
				case MouseMode.MOVE_FIGURE:
					that.activeNode.node.setPosition(x, y, frame)
					break;
				case MouseMode.CHANGE_LENGTH:
					that.activeNode.node.setAlpha(Math.atan2(-x + xOffset, -y + yOffset) - that.activeNode.alpha, frame);
					that.activeNode.node.setLength(position.distanceTo(new THREE.Vector2(xOffset, yOffset)));
					break;
			}
			that.activeNode.node.draw(frame);
			that.renderer.update();
			//that.timelineHandler.updateFrame(frame);
		}
	}

	private getMouseDownFunction() {
		var that = this;
		return function(event) {
			switch (that.mode) {
				case MouseMode.IDEL:
					var figures: IFigure[] = that.controller.getProject().getFigures();
					var frame: number = that.controller.getFrameHandler().getFrame();
					var position: THREE.Vector2 = that.getMousePosition(event);
					var node = that.getProximityNode(position, frame);
					if (node != null) {
						that.activeNode = node;
						that.mode = node.node.isRoot() ? MouseMode.MOVE_FIGURE : MouseMode.MOVE_LIMB;
						that.activeNode.node.getRoot().manifest(frame);
					}
					return;
				case MouseMode.CHANGE_LENGTH:
					that.mode = MouseMode.IDEL;
					return;
			}
		}
	}

	private getMouseUpFunction() {
		var that = this;
		return function() {
			switch (that.mode) {
				case MouseMode.MOVE_FIGURE:
				case MouseMode.MOVE_LIMB:
					that.mode = MouseMode.IDEL;
					break;
			}
		}
	}

	private getContextMenuFunction() {
		var that = this;
		return function(event) {
			var frame = that.frameHandler.getFrame();
			var node = that.getProximityNode(that.getMousePosition(event), frame);
			if (node != null) {
				$("#contextMenu").show().css("left", event.clientX).css("top", event.clientY);
				that.activeNode = node;
			}
			return false;
		}
	}

}