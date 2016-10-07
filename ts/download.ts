/// <reference path="renderer.ts" />
/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/jszip.d.ts" />
/// <reference path="./definitions/FileSaver.d.ts" />
/// <reference path="./figures/node.ts" />
/// <reference path="./figures/ifigure.ts" />

class Download {

	private renderer: GLRenderer;

	constructor(renderer: GLRenderer) {
		this.renderer = renderer;
	}

	public zipAndSave(figures: IFigure[]) {
		let zip = new JSZip();
		$.each(figures, function(index, figure) { figure.getRoot().setMode(NodeMode.Play); });
		for (var i = 1; i < 50; i++) {
			$.each(figures, function(index, figure) { figure.getRoot().draw(i); })
			this.renderer.update();
			var img = $("canvas").get(0)["toDataURL"]();
			zip.file("frame" + i + ".png", img.replace("data:image/png;base64,", ""), { base64: true });
			console.log("make frame: " + i);
		}
		zip.generateAsync({ type: "blob" }).then(
			function(content) {
				saveAs(content, "test.zip");
			});
	}


}