/// <reference path="renderer.ts" />
/// <reference path="./definitions/jquery.d.ts" />
/// <reference path="./definitions/jszip.d.ts" />
/// <reference path="./definitions/FileSaver.d.ts" />
/// <reference path="./figures/node.ts" />
/// <reference path="./figures/ifigure.ts" />

class Download {

	private renderer: GLRenderer;
	private startFrame: number = 1;
	private stopFrame: number = 100;

	constructor(renderer: GLRenderer) {
		this.renderer = renderer;
	}

	public zipAndSave(figures: IFigure[]) {
		let $progress = $("#divProgress");
		let that = this;
		let zip = new JSZip();
		let asyncList: Function[] = new Array();
		$.each(figures, function(index, figure) { figure.getRoot().setMode(NodeMode.Play); });
		var pack =0;
		for (var i = this.startFrame; i <= this.stopFrame; i++) {
			let frame = i;
			asyncList.unshift(function() {
				$.each(figures, function(index, figure) { figure.getRoot().draw(frame); })
				that.renderer.update();
				var img = $("canvas").get(0)["toDataURL"]();
				zip.file("frame" + frame + ".png", img.replace("data:image/png;base64,", ""), { base64: true });
				pack++;
				$progress.css("width",100/(that.stopFrame-that.startFrame)*pack+"%");
				$progress.text("Frame: " + frame);
				if (asyncList.length != 0) {
					setTimeout(asyncList.pop(), 0);
				} else {
					$("#prepareZipModal")["modal"]("hide");
					zip.generateAsync({ type: "blob" }).then(
						function(content) {
							saveAs(content, "test.zip");
						});
				}
			});
		}
		// We use setTimeout to build the frames and zip asynchronously; the web-interface will be responsive
		setTimeout(asyncList.pop(),0);

	}

	public setStartFrame(startFrame: number){
		this.startFrame = startFrame;
	}

	public setStopFrame(stopFrame: number){
		this.stopFrame = stopFrame;
	}

}