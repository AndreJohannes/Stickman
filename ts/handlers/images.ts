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
			$img.click(function() {
				let $img_clone = $img.clone();
				$("#cropImageModal .modal-body").empty().append($img_clone);
				$("#cropImageModal")["modal"]("show");
				$img_clone.css("width", "500px");
				$img_clone["cropper"]({
					"minContainerWidth": 500, "minContainerHeight": 400,
					built: function() {
						$img_clone["cropper"]('setDragMode', "move");
					}
				});
				$("#btnImageSeclection").off().click(function() {
					let data = $img_clone["cropper"]("getData");
					let texture = that.controller.getTextureHandler().getTexture(uuid);
					let rect = new Rect(data.x, data.y, data.x + data.width, data.y + data.height, texture);
					rect.setPivot(new THREE.Vector2(data.x, data.y));
					rect.setAnchor(new THREE.Vector2(data.x + data.width, data.y + data.height));
					let figure = new MonadFigure(rect);
					project.getFigures().push(figure);
					that.controller.update();
					//debugger;
				})
			});
			this.$images.append($img);
		}
	}



}