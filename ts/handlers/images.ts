/// <reference path="../sticky.ts" />


class ImageHandler{

	private controller: Sticky;
	private $images: JQuery;

	constructor(controller: Sticky){
		this.controller = controller;
		this.$images = $("#images");
		this.update();
	}

	public update(){
		var project = this.controller.getProject();
		this.$images.empty();
		for(var image of project.getImages()){
			var $img = $("<img>");
			$img.attr("src", image);
			$img.click(function(){$("#cropImageModal .modal-body").append($img);$("#cropImageModal")["modal"]("show"); });
			this.$images.append($img);
		}
	}



}