/// <reference path="../sticky.ts" />


class ImageHandler {

	private controller: Sticky;
	private $images: JQuery;

	constructor(controller: Sticky) {
		this.controller = controller;
		this.$images = $("#images");
		this.update();
	}

	public update() {
		let that = this;
		let project = this.controller.getProject();
		this.$images.empty();
		let images = project.getImages();
		for (var key in images) {
			let uuid = key
			let $img = $("<img>");
			$img.attr("src", images[uuid]);
			$img.data("uuid", uuid);
			$img.click(this.cropAndSelect($img, uuid));
			this.$images.append($img);
		}
	}

	private cropAndSelect($img: JQuery, uuid: string) {
		let that = this;
		let project = this.controller.getProject();
		return function() {
			let $img_clone = $img.clone();
			$("#cropImageModal .modal-body").empty().append($img_clone);
			$("#cropImageModal")["modal"]("show");
			$img_clone.css("width", "500px");
			$img_clone["cropper"]({
				"minContainerWidth": 500, "minContainerHeight": 400,
				built: function() {
					$img_clone["cropper"]('setDragMode', "move");
					let $divAnchor = $("<div class=\"anchorPoint\" >");
					let $divPivot = $("<div class=\"pivotPoint\" >");
					let $divContainer = $(".cropper-container");
					$divContainer.append($divAnchor).append($divPivot);
					let mouseDown = function() {
						let $div = $(this);
						$divContainer.mousemove(function(event) {
							let dx = event.pageX - $(".cropper-container").offset()["left"];
							let dy = event.pageY - $(".cropper-container").offset()["top"];
							$div.css("top", dy-5).css("left", dx-5);
							$div.data("top", dy).data("left", dx);
							return true;
						});
						$divContainer.mouseup(function() {
							$divContainer.unbind("mousemove");
						})
					};
					$divPivot.mousedown(mouseDown);
					$divAnchor.mousedown(mouseDown);
				}
			});
			$("#btnImageSeclection").off().click(function() {
				$("#cropImageModal")["modal"]("hide");
				let data = $img_clone["cropper"]("getData");
				let canvasData = $img_clone["cropper"]("getCanvasData");
				let texture = that.controller.getTextureHandler().getTexture(uuid);
				let rect = new Rect(data.x, data.y, data.x + data.width, data.y + data.height, texture);
				let anchor = {
					"y": ($(".anchorPoint").data("top") - canvasData["top"]) * canvasData["naturalHeight"] / canvasData["height"],
					"x": ($(".anchorPoint").data("left") - canvasData["left"]) * canvasData["naturalWidth"] / canvasData["width"]
				};
				let pivot = {
					"y": ($(".pivotPoint").data("top") - canvasData["top"]) * canvasData["naturalHeight"] / canvasData["height"],
					"x": ($(".pivotPoint").data("left") - canvasData["left"]) * canvasData["naturalWidth"] / canvasData["width"]
				};
				rect.setPivot(new THREE.Vector2(pivot.x, pivot.y));
				rect.setAnchor(new THREE.Vector2(anchor.x, anchor.y));
				let figure = new MonadFigure(rect);
				project.getFigures().push(figure);
				that.controller.update();
				//debugger;
			})
		}
	}

}