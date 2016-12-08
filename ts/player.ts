/// <reference path="renderer.ts" />
/// <reference path="./figures/node.ts" />
/// <reference path="./figures/ifigure.ts" />

class Player {

	private renderer: GLRenderer;
	private delay: number = 1000 / 30;
	private stopSignal: Boolean = false;
	private loops: Boolean = false;
	private startFrame: number = 1;
	private stopFrame: number = 100;


	constructor(renderer: GLRenderer) {
		this.renderer = renderer;
	}

	public play(figures: IFigure[], callback) {
		this.setMode(figures, NodeMode.Play);
		this._play(this.startFrame, figures, callback)();
	}

	public stop() {
		this.stopSignal = true;
	}

	public loop(loops: boolean){
		this.loops = loops;
	}

	public setStartFrame(startFrame:number){
		this.startFrame = startFrame;
	}

	public setStopFrame(stopFrame:number){
		this.stopFrame = stopFrame;
	}

	private _play(frame: number, figures: IFigure[], callback) {
		var that = this;
		return function() {
			if ((frame > that.stopFrame && !that.loops) || that.stopSignal) {
				that.setMode(figures, NodeMode.Edit);
				callback();
				that.stopSignal = false;
				return;
			}else if(frame > that.stopFrame)
				frame = that.startFrame;
			setTimeout(that._play(frame + 1, figures, callback), that.delay);
			for (let figure of figures) {
				figure.getRoot().draw(Math.round(frame));
			}
			that.renderer.update();
		}
	}

	public setFPS(value: number) {
		this.delay = 1000 / value;
	}

	private setMode(figures: IFigure[], mode: NodeMode) {
		for (let figure of figures) {
			figure.getRoot().setMode(mode);
		}
	}

}