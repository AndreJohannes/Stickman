/// <reference path="../definitions/jquery.d.ts" />
/// <reference path="../renderer.ts" />

class MouseHandler{

	private $canvas: JQuery; 

	constructor(renderer: GLRenderer){
		this.$canvas = $(renderer.getDom());
		this.$canvas.on("contextmenu",function(){
			console.log("haha");
		});
	}

}